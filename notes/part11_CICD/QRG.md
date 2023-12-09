# Quick Reference Guide for Basic CI/CD Deployment Pipeline

## Example file

From now on, this file will be referred to as `example`:

```yaml
name: Deployment pipeline

# This workflow will be triggerred when:
on:
  # a pushed is made...
  push:
    # to branch `main`
    branches:
      - main
  # and when a pull request is made to...
  pull_request:
    # branch main
    branches: [main]
    # when the pull request is opened or updated
    types: [opened, synchronize]

jobs:
  deployment_pipeline:
    # This job will run on a virtual machine with this system
    runs-on: ubuntu-20.04

    steps:
        # the `uses` keyword tells the workflow to run a specific *action*. 
        # An action is a reusable piece of code, like a function. 
        # Actions can be defined in your repository in a separate file 
        # or you can use the ones available in public repositories.
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v2
        # `with` provides a map of inputs that are passed to the executed workflow
        with:
          node-version: '20'

      - name: npm install
        # run this command in the console of the virtual machine
        run: npm install

      - name: lint
        run: npm run eslint

      - name: test
        run: npm run test

      - name: build
        run: npm run build

      - name: e2e tests
        uses: cypress-io/github-action@v2
        with:
          command: npm run test:e2e
          start: npm run start-prod
          wait-on: http://localhost:5000

      - name: deploy to heroku
        # if a push is made, and the commit messages don't include the expression '#skip' (to skip deployment)
        if: ${{ github.event_name == 'push' && !contains(join(github.event.commits.*.message, ''), '#skip') }}
        # Specific action set by the platform
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          # Parameters and options set by the platform
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: 'calm-wildwood-40210'
          heroku_email: 'mluukkai@iki.fi'
          healthcheck: 'https://calm-wildwood-40210.herokuapp.com/health'
          checkstring: 'ok'
          delay: 1
          rollbackonhealthcheckfailed: true

      - name: Deployment success
        # if the current job succeeds (last step - deployment - didn't fail)
        if: ${{ success() }}
        # settings defined by the particular webhook, in this case,
        # we use discord-webhook-notify,
        # found on the GitHub Actions Marketplace:
        # <https://github.com/marketplace/actions>
        uses: rjstone/discord-webhook-notify@v1
        with:
          severity: info
          webhookUrl: ${{ secrets.DISCORD_WEBHOOK }}
          avatarUrl: ${{ github.event.sender.avatar_url }}
          description: to https://calm-wildwood-40210.herokuapp.com/ by ${{ github.event.head_commit.author.username }}
          details: ''
          text: A new version of Pokedex deployed

      - name: Deployment failure
        # if the current job fails (last step - deployment - fails)
        if: ${{ failure() }}
        uses: rjstone/discord-webhook-notify@v1
        with:
          severity: error
          color: '#ff0000'
          webhookUrl: ${{ secrets.DISCORD_WEBHOOK }}
          avatarUrl: ${{ github.event.sender.avatar_url }}
          description: commit ${{ github.event.head_commit.url }} by ${{ github.event.head_commit.author.username }} broke the build :(
          details: ''
          text: Build failed

  tag_release:
    ## the job `deployment_pipeline` has to be successful for this job to execute
    needs: [deployment_pipeline]
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: '0'
      - name: Bump version and push tag
        if: ${{ github.event_name == 'push' && !contains(join(github.event.commits.*.message, ''), '#skip') }}
        # again, another custom action we found on the actions marketplace
        uses: anothrNick/github-tag-action@1.36.0
        # settings defined by the action provider
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          DEFAULT_BUMP: 'patch'
```

## Explanation of `example`

See the [Official Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions>).

This file defines a workflow. In this case, this is the workflow for basic deployment, which consists of:

- Install dependencies in the GitHub virtual machine that will test the code
- Lint source code
- Perform unit tests
- Build code into working version (minimizing, compiling into deployment code, etc.) for production
- Perform E2E tests
- If tests are successful:
    - Deploy to platform (Heroku in `example`)
    - Send message to a Discord server
    - Bump version and push tag to GitHub
- If tests are NOT successful:
    - Send message to a Discord server

### `name` defines a name for the workflow.


### `on` defines which events will trigger these actions

In this case:

- `push` into `main`: every time a commit is pushed into the `main` branch
- `pull_request` into `main`, with `types` `opened` and `synchronize`: The workflow will run when a pull request into the `main` branch is opened or updated.

There are many more triggers available. For example, we could create a timed trigger that could run certain workflow every Monday.

See <https://docs.github.com/en/actions/using-workflows/triggering-a-workflow>.

### `jobs` defines the separate jobs that the workflow will execute.

In this case:

- `deployment_pipeline` (install dep., lint, tests, build, e2e tests, deploy if successful, message to discord)
- `tag_release` (bump version and push tag)

Each job consists on:

- Settings for the job environment
- Steps

And each step consists on, roughly: a name, settings, options, conditions, commands...
