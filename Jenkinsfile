library 'magic-butler-catalogue'

def PROJECT_NAME = "ngprogress"
def CURRENT_BRANCH = [env.CHANGE_BRANCH, env.BRANCH_NAME]?.find{branch -> branch != null}
def TRIGGER_PATTERN = ".*@logdnabot.*"

pipeline {
  agent none

  options {
    timestamps()
    ansiColor 'xterm'
  }

  triggers {
    issueCommentTrigger(TRIGGER_PATTERN)
  }

  stages {
    stage('Validate PR Source') {
      when {
        expression { env.CHANGE_FORK }
        not {
          triggeredBy 'issueCommentCause'
        }
      }
      steps {
        error("A maintainer needs to approve this PR for CI by commenting")
      }
    }

    stage('Test Suite') {
      matrix {
        axes {
          axis {
            name 'NODE_VERSION'
            values '12', '14', '15'
          }
        }

        agent {
          docker {
            image "us.gcr.io/logdna-k8s/node:${NODE_VERSION}-ci"
          }
        }

        environment {
          GITHUB_TOKEN = credentials('github-api-token')
          NPM_CONFIG_CACHE = '.npm'
          NPM_CONFIG_USERCONFIG = '.npm/rc'
          SPAWN_WRAP_SHIM_ROOT = '.npm'
        }

        stages {

          stage('Test') {
            steps {
              sh 'mkdir -p .npm coverage'
              sh 'npm install'
              sh 'npm run test'
            }

            post {
              always {
                junit 'coverage/test.xml'
                publishHTML target: [
                  allowMissing: false,
                  alwaysLinkToLastBuild: false,
                  keepAll: true,
                  reportDir: 'coverage/lcov-report',
                  reportFiles: 'index.html',
                  reportName: "coverage-node-v${NODE_VERSION}"
                ]
              }
            }
          }
        }
      }
    }

    stage('Test Release') {
      when {
        beforeAgent true
        not {
          branch 'main'
        }
      }

      agent {
        docker {
          image "us.gcr.io/logdna-k8s/node:12-ci"
          customWorkspace "${PROJECT_NAME}-${BUILD_NUMBER}"
        }
      }

      environment {
        GITHUB_TOKEN = credentials('github-api-token')
        NPM_TOKEN = credentials('npm-publish-token')
        NPM_CONFIG_CACHE = '.npm'
        NPM_CONFIG_USERCONFIG = '.npm/rc'
        SPAWN_WRAP_SHIM_ROOT = '.npm'
        GIT_BRANCH = "${CURRENT_BRANCH}"
        BRANCH_NAME = "${CURRENT_BRANCH}"
        CHANGE_ID = ""
      }

      steps {
        sh 'mkdir -p .npm'
        sh 'npm install'
        sh "npm run release -- --dry-run --no-ci --branches ${CURRENT_BRANCH}"
      }
    }

    stage('Release') {
      when {
        beforeAgent true
        branch 'main'
      }

      agent {
        docker {
          image "us.gcr.io/logdna-k8s/node:12-ci"
          customWorkspace "${PROJECT_NAME}-${BUILD_NUMBER}"
        }
      }

      environment {
        GITHUB_TOKEN = credentials('github-api-token')
        NPM_TOKEN = credentials('npm-publish-token')
        NPM_CONFIG_CACHE = '.npm'
        NPM_CONFIG_USERCONFIG = '.npm/rc'
        SPAWN_WRAP_SHIM_ROOT = '.npm'
        GIT_AUTHOR_NAME = 'LogDNA Bot'
        GIT_AUTHOR_EMAIL = 'bot@logdna.com'
        GIT_COMMITTER_NAME = 'LogDNA Bot'
        GIT_COMMITTER_EMAIL = 'bot@logdna.com'
      }

      steps {
        sh 'mkdir -p .npm'
        sh 'npm install'
        sh 'npm run release'
      }
    }
  }
}
