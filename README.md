# ChatGPT integration with Jira

This project contains a Forge app written in JavaScript that connects to Azure ChatGPT instance to provide useful internal comments when a new issue is created.

For more information, please see the [document](https://docs.google.com/document/d/1FESPEJdeH53Vir_IRxBnY5DnD8k7Nrd8OaOEEYSMVhc/edit?usp=sharing) about how to deploy Forge Apps.

## Requirements

- Azure Open AI backend endpoint
- Atlassian Service Managament page

## Quick start
- Open the manifiest.yml and src/index.js files.

- Replace the strings ```"<yourAzureOpenAIInstanceGoesHere>" ``` with your Azure Open AI backend endpoint.

- Install top-level dependencies:
```
npm install
```

- Deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

## Deploy apps using Forge and Jira

**Getting started with Forge**

1. First off, you need to create an Atlassian account by signing up using this [link](https://id.atlassian.com/signup) and follow the onscreen instructions. Once you have your account you can now start using Jira.

1. To start using Forge, you need to Install forge-cli globally by opening your terminal and paste the following command:

```sudo npm install -g @forge/cli```

1. Check you have installed Forge properly by using this command:

```forge --version```

**Important** : if you haven't set up your development site yet, you should follow these steps:

1. Go to [Free: Jira Software | Atlassian](https://www.atlassian.com/es/software/jira/free)
2. Click Jira Software.
3. Enter your Email and the URL of your development site. For example: \<site-name\>.atlassian.net

4. And you can skip the following steps. (Optional)
5. You need to select a template. In this case, select "Board for Visualizing Our Workflow".

6. Enter a name for your project. And click Create.
7. And you can skip the following steps. (Optional).
8. And you are done!. Now you have a new board for visualizing your workflow.
9. Now we can see we have our own site with the following URL:

```https://\<name-of-your-site\>.atlassian.net/jira/software/projects/\<project\>/boards/1```

**Log in with an Atlassian API token**

Create an Atlassian API token to log in to the CLI. The CLI uses your token when running commands.

- Go to [API Token](https://id.atlassian.com/manage/api-tokens)
- Click Create API token.
- Enter a label to describe your API token. For example, forge-api-token.
- Click Create.
- Click Copy to clipboard and close the dialog box.

1. Once you have copied your API token, link Forge to your Jira account using the forge login command; you'll be asked whether to allow Forge to collect usage analytics data and you can either choose yes or no.

1. Paste the API token into the terminal and you should be ready to go.

**Deploying an app**

Once you have set up your Forge environment and Jira account it's time to deploy an app to your account.

It's important to mention that some apps are not visible in the same environment (For example [this app](https://developer.atlassian.com/platform/forge/build-a-custom-ui-app-in-jira/) won't be displayed in the same page as [this one](https://developer.atlassian.com/platform/forge/build-a-custom-ui-app-in-jira-service-management/)) due to being different types of apps.

Any time you make changes to your app code, rebuild the static frontend and then run a deploy using the forge deploy command. This command compiles your FaaS code, and deploys your functions and static assets to the Atlassian cloud.

1. Navigate to the app's top-level directory.
2. Use the command forge deploy to start the deploy process-
3. Once the deployment has finished, run forge install to install the app onto your Atlassian site.
4. Select your Atlassian product using the arrow keys and press the enter key.
5. Enter the URL for your development site. For example: example.atlassian.net.

Once the successful installation message appears, your app is installed and ready to use on the specified site. You can always delete your app from the site by running the forge uninstall command.

If you want to see all your deployed and installed apps on Jira. You can access the developer console [here](https://developer.atlassian.com/console/myapps/).
