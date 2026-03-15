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
		stage('check changes') {
			steps {
				script {
					def hasFrontendChange = currentBuild.changeSets.any { cs ->
						cs.items.any { item ->
							item.affectedFiles.any { f -> f.path.startsWith('frontend/') }
						}
					}
					if (!hasFrontendChange) {
						currentBuild.result = 'NOT_BUILT'
						error('No frontend changes, skipping.')
					}
				}
			}
		}

		stage('setup-github') {
			steps {
				dir('frontend') {
					sh '''
                       git config user.email "gitops@cnapcloud.com"
                       git config user.name "jenkins-bot"
					   git config --global url.https://mirinus:${GITHUB_TOKEN}@github.com/cnapcloud/.insteadOf https://github.com/cnapcloud/
					'''
				}
			}
		}

		stage('push image') {
			steps {
				dir('frontend') {
					sh '''
                         docker login harbor.cnapcloud.com -u admin -p ${HARBOR_PASSWD}
                         make docker-build
					'''
				}
			}
		}

		stage('update gitops') {
			steps {
				dir('frontend') {
					sh 'make update-tag'
				}
			}
		}
	}	

}	
