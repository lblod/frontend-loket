# frontend-loket

Frontend of the loket application

## Environment variables

The [ember-proxy-service](https://github.com/mu-semtech/ember-proxy-service#configure-environment-variables-in-the-frontends-container) docker image (which we use to host the frontend) supports configuring environment variables. The following options are available for the loket image.

### General

| Name                                       | Description                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `EMBER_LPDC_URL`                           | Link to the LPDC application (only required when the feature flag is enabled)           |
| `EMBER_WORSHIP_DECISIONS_DATABASE_URL`     | Link to the worship decisions database                                                  |
| `EMBER_WORSHIP_ORGANISATIONS_DATABASE_URL` | Link to the worship organisations database                                              |
| `EMBER_GLOBAL_SYSTEM_NOTIFICATION`         | This can be used to display a message at the top of the application. HTML is supported. |

### ACM/IDM

| Name                               | Description                                                                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EMBER_ACMIDM_CLIENT_ID`           | The unique client id for a specific environment                                                                                                          |
| `EMBER_ACMIDM_AUTH_URL`            | The URL where users will be redirected to when they want to log in                                                                                       |
| `EMBER_ACMIDM_AUTH_REDIRECT_URL`   | The callback URL that ACM/IDM will use after the user logs in successfully                                                                               |
| `EMBER_ACMIDM_LOGOUT_URL`          | The URL where users will be redirected to when they want to log out                                                                                      |
| `EMBER_ACMIDM_SWITCH_REDIRECT_URL` | The URL that will be used when "switching users" is enabled in ACM/IDM. After logout, users can select one of their other accounts to simplify the flow. |

> When ACM/IDM is not configured, the frontend will default to the "mock login" setup instead.

### Feature flags

Feature flags are new / experimental features that can be enabled by setting them to "true".

> There are no feature flags available right now.

### Plausible

| Name                         | Description                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------- |
| `EMBER_ANALYTICS_API_HOST`   | The URL of the Plausible host to which all events will be sent                   |
| `EMBER_ANALYTICS_APP_DOMAIN` | The app domain which will be used to group the events in the Plausible dashboard |

> Analytics will only be enabled when both variables are configured.

### Sentry

| Name                       | Description                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `EMBER_SENTRY_DSN`         | Sentry DSN. Setting this activates the sentry integration.                                      |
| `EMBER_SENTRY_ENVIRONMENT` | The name of the environment under which the errors should be reported. Defaults to 'production' |

## Releasing a new version

We use [`release-it`](https://github.com/release-it/release-it) to handle our release flow 

### Generating the changelog (optional)
At the moment the changelog is updated manually. To make this a bit easier you can generate a basic changelog based on the merged PRs with [`lerna-changelog`](https://github.com/lerna/lerna-changelog) by  adding the correct labels and updating the PR titles.

> `lerna-changelog` requires a Github [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to work properly.

The following command can  be used to generate the changelog:

`GITHUB_AUTH=your-access-token npx lerna-changelog`

### Creating a new release
Simply run `npm run release` and follow the prompts.

> If you generated the changelog using lerna-changelog you can add it to the changelog file and add it to the staged changes when release-it asks if you want to commit the changes. This will ensure that the changelog change is part of the release commit.

After the new tag is created and pushed CI will take care of building the docker image.
