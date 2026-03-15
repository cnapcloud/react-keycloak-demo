pipeline {
    agent { label 'build' }

	environment {
       GITHUB_TOKEN=credentials('github-token')
       HARBOR_PASSWD=credentials('harbor-password')
    }

	options {
		disableConcurrentBuilds()
		timeout(time: 30, unit: 'MINUTES') 
		buildDiscarder(logRotator(numToKeepStr: '14'))
	}

	stages {
		stage('setup-github') {
			steps {
				sh '''
                   git config user.email "gitops@cnapcloud.com"
                   git config user.name "jenkins-bot"
				   git config --global url.https://mirinus:${GITHUB_TOKEN}@github.com/cnapcloud/.insteadOf https://github.com/cnapcloud/
				'''
			}
		}

		stage('push image') {
			steps {
				sh '''
                  docker login harbor.cnapcloud.com -u admin -p ${HARBOR_PASSWD}
                  make docker-build
				'''
			}
		}

		stage('update gitops') {
			steps {
				sh 'make update-tag'
			}
		}
	}	

}	
