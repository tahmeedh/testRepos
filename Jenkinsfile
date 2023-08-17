def email_recipients = 'jeff.jiang@globalrelay.net'
def nodeVersion = 'v16.16.0'
def buildsToKeep = 20
def timeOutTime = 40
def buildImageVersion = '0.0.1-beta'
def buildImage = "docker-repo.globalrelay.net/test-automation/va-test-image:${buildImageVersion}"
def buildNode = 'build3-at-int-nvan.dev-globalrelay.net'
def targetEnv = ["cpqa2-va1", "cpqa2-pd1", "cpqa2-pd2", "cpqa2-ca1", "cpqa2-sq1", "cpqa2", "cpqa1"]

pipeline {
    agent {
        label "${buildNode}"
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: "${buildsToKeep}"))
        timestamps()
        timeout(time: timeOutTime, unit: "MINUTES")
    }
    parameters {
        choice(name:"targetEnvParam", choices: targetEnv, description:"set the label of the build node")
    }
    stages {
        stage('Preparation') {
            steps {
                // Wipe out workspace for clean build each time
                deleteDir()
                sh '''
                    git clone ssh://git@stash.globalrelay.net:7999/portal/jsat-e2e-chat-window.git
                '''
                
                script {
                    nodeVersion = readFile(file: './jsat-e2e-chat-window/.nvmrc').trim()
                    echo "Node version loaded from .nvmrc file is [$nodeVersion]"
                }
                
                nvm(nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.37.2/install.sh',
                    nvmInstallDir: '/data1/jenkins_slave/.nvm',
                    nvmIoJsOrgMirror: 'https://nodejs.org/dist',
                    nvmNodeJsOrgMirror: 'https://nodejs.org/dist',
                    version: "${nodeVersion}") {
                    sh '''
                        cd jsat-e2e-chat-window
                        git submodule init
                        git submodule update
                    '''
                }
            }
        }
        stage('Test') {
            steps {
                script {
                  echo "Target environment selected is [${params.targetEnvParam}]"
                  returnCode = sh (
                    script: "docker run --rm -v ${WORKSPACE}/jsat-e2e-chat-window:/opt/jsat-e2e-chat-window -w /opt/jsat-e2e-chat-window docker-repo.globalrelay.net/test-automation/va-test-image:0.0.1-beta bash -c '/opt/jsat-e2e-chat-window/test.sh  -en ${params.targetEnvParam} > va-e2e-test.log 2>&1'",
                    returnStatus: true)
                  echo "Exit code for docker run command is [${returnCode}]"
                  if (returnCode != 0) {
                    echo "Set build job status to [FAILED] because docker container return non-zero code"
                    error("Build failed because of lint tests failed with some errors")
                  }
                }
            }
        }
    }
    post {
        failure {
            script {
                echo "Sending notification email to $email_recipients"
                emailext body: "Build failed, see: $JOB_URL", recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']], subject: "Jenkins job failed: $JOB_NAME", to: email_recipients
            }
        }
    }
}
