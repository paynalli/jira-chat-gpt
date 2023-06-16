import ForgeUI, {
  render,
  ProjectSettingsPage,
  useState,
  Toggle,
  TextField,
  Form,
  TextArea,
  Select,
  Option,
  useEffect,
  Button,
  Range,
} from "@forge/ui";
import api, { route, storage } from "@forge/api";

const CHATGPT_API =
  "<yourAzureOpenAIInstanceGoesHere>";

export async function eventHandler(event, context) {
  async function getChatgptResponse() {
    const issueResponse = await api
      .asApp()
      .requestJira(
        route`/rest/api/2/issue/${event.issue.id}?fields=summary,description`
      );
    await checkResponse("Jira Issue API", issueResponse);
    const { summary, description } = (await issueResponse.json()).fields;

    const summaryResponse = await api.fetch(`${CHATGPT_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": await storage.getSecret("chatgptKey"),
      },
      body: JSON.stringify({
        prompt: `${await storage.get("chatgptInitialPrompt")} 
        \n${JSON.stringify(summary)}
        \n${JSON.stringify(description)}`,
        temperature: await storage.get("chatgptTemperature"),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 500,
        best_of: 1,
      }),
    });
    await checkResponse("ChatGPT API", summaryResponse);
    const finalResponse = await summaryResponse.json();
    return finalResponse.choices[0].text;
  }

  async function writeInternalComment() {
    var bodyData = JSON.stringify({
      body: await getChatgptResponse(),
      public: false,
    });

    const commentResponse = await api
      .asApp()
      .requestJira(
        route`/rest/servicedeskapi/request/${event.issue.id}/comment`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      );
    await checkResponse("Jira Issue Comment API", commentResponse);
  }

  return (await storage.get("chatgptEnabled")) === true
    ? writeInternalComment()
    : true;
}

const App = () => {
  const [apiData, setApiData] = useState({});

  const options = [
    ["ask", "Ask a question"],
    ["submit", "Submit a request or incident"],
  ];

  const handleSubmit = async (data) => {
    storage.set("chatgptEnabled", data.isChatgptEnabled);
    storage.setSecret("chatgptKey", data.chatgptKey);
    storage.set("chatgptInitialPrompt", data.initialPrompt);
    storage.set("chatgptRequestTypes", data.requestTypes);
    storage.set("chatgptTemperature", data.temp);
    storage.set("chatgptTokens", data.tokens);
    setApiData(data);
  };

  const getData = async () => {
    const _data = {
      isChatgptEnabled: await storage.get("chatgptEnabled"),
      chatgptKey: await storage.getSecret("chatgptKey"),
      initialPrompt: await storage.get("chatgptInitialPrompt"),
      temp: await storage.get("chatgptTemperature"),
      tokens: await storage.get("chatgptTokens"),
      requestTypes: await storage.get("chatgptRequestTypes"),
    };
    setApiData(_data);
  };

  useEffect(async () => {
    await getData();
  }, []);

  // Render the UI
  return (
    <Form
      onSubmit={handleSubmit}
      actionButtons={[
        <Button
          text="Reset defaults"
          onClick={() =>
            setApiData({
              isChatgptEnabled: false,
              chatgptKey: "",
              initialPrompt: "",
              requestTypes: ["ask"],
              temp: 0.7,
              tokens: 128
            })
          }
        />,
      ]}
    >
      <Toggle
        label="Enable Jira-ChatGPT Integration"
        name="isChatgptEnabled"
        isRequired
        defaultChecked={apiData.isChatgptEnabled}
      />
      <TextField
        label="ChatGPT API Key"
        name="chatgptKey"
        isRequired
        type="password"
        defaultValue={apiData.chatgptKey}
      />
      <TextArea
        label="Initial prompt"
        name="initialPrompt"
        placeholder="Write an initial prompt to give ChatGPT about what you want"
        defaultValue={apiData.initialPrompt}
      />
      <Range
        label="Temperature (0 to 1)"
        name="temp"
        min={0}
        max={1}
        step={0.1}
        defaultValue={apiData.temp}
      />
      <TextField
        label="Number of Tokens"
        name="tokens"
        type="number"
        defaultValue={apiData.tokens}
      />
      <Select label="Request Types" name="requestTypes" isMulti isRequired>
        {options.map(([value, label]) => (
          <Option
            label={label}
            value={value}
            defaultSelected={
              apiData.requestTypes === undefined
                ? false
                : apiData.requestTypes.includes(value)
            }
          />
        ))}
      </Select>
    </Form>
  );
};

/**
 * Checks if a response was successful, and log and throw an error if not.
 * Also logs the response body if the DEBUG_LOGGING env variable is set.
 * @param apiName a human readable name for the API that returned the response object
 * @param response a response object returned from `api.fetch()`, `requestJira()`, or similar
 */
async function checkResponse(apiName, response) {
  if (!response.ok) {
    const message = `Error from ${apiName}: ${
      response.status
    } ${await response.text()}`;
    console.error(message);
    throw new Error(message);
  } else if (process.env.DEBUG_LOGGING) {
    console.debug(`Response from ${apiName}: ${await response.text()}`);
  }
}

export const run = render(
  <ProjectSettingsPage>
    <App />
  </ProjectSettingsPage>
);
