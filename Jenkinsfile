pipeline {
    agent any
    parameters {
        booleanParam(name: 'MANUAL_TRIGGER', defaultValue: false, description: 'Check to trigger manually')
    }
    triggers {
        githubPush()  // Auto-trigger on GitHub push
    }
    environment {
        NODE_VERSION = "v22.5.1"
        NVM_DIR = "/root/.nvm"
        PATH = "${NVM_DIR}/versions/node/${NODE_VERSION}/bin:${env.PATH}"
    }
    stages {
        stage('Check Branch') {
            steps {
                script {
                    def branch = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    if (branch != 'master' && !params.MANUAL_TRIGGER) {
                        error("Build stopped: Not on master branch")
                    }
                }
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh '''
                    export NVM_DIR="/root/.nvm"
                    source $NVM_DIR/nvm.sh
                    nvm use v22.5.1
                    npm install
                '''
            }
        }
        stage('Build') {
            steps {
                sh '''
                    export NVM_DIR="/root/.nvm"
                    source $NVM_DIR/nvm.sh
                    nvm use v22.5.1
                    npm run build
                '''
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    rm -R /var/www/admin/*
                    cp -r build/* /var/www/admin
                '''
            }
        }
    }
}
