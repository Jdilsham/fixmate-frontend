pipeline{
    agent any

    options {
            timestamps()
            disableConcurrentBuilds()
            buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    parameters {
    string(
        name: 'IMAGE_TAG',
        description: 'Docker image tag to deploy (from GitHub Actions)'
    )
    }

    environment {
        DOCKERHUB_USER = credentials('dockerhub-username')
        IMAGE_NAME = credentials('dockerhub-image-name-frontend')
        GCP_PROJECT		=	credentials('gcp-project-id')
		GKE_CLUSTER		=	credentials('gke-cluster-name')
		GKE_ZONE		=	credentials('gke-zone')
		K8S_NAMESPACE	=	credentials('k8s-namespace')

        NEW_IMAGE		=	"${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
    }

    stages{
        stage('Checkout Code'){
            steps{
                checkout scm
            }
        }

        stage('GCloud Auth & Connect to GKE'){
            steps{
                withCredentials([file(credentialsId: 'gcp-sa-key', variable: 'GCLOUD_KEY')]){
                    sh """
                        echo Authenticating to Google Cloud...
                        gcloud auth activate-service-account --key-file=${GCLOUD_KEY}
                        gcloud config set project ${GCP_PROJECT}
                        gcloud container clusters get-credentials ${GKE_CLUSTER} --zone ${GKE_ZONE}
                    """
                }
            }
        }

        stage('Apply Kubernetes Manifests'){
            steps{
                sh """
                    echo Applying Kubernetes manifests...
                    kubectl apply -f K8s/ -n ${K8S_NAMESPACE}
                """
            }
        }

        stage('Update Deployment Image'){
            steps{
                sh """
                    echo Updating deployment image to ${NEW_IMAGE}
                    kubectl set image deployment/fixmate-frontend fixmate-frontend=${NEW_IMAGE} -n ${K8S_NAMESPACE}
                """
            }
        }

        stage('verify Rollout'){
            steps{
                script{
                    try{
                        sh """
                            echo Verifying rollout status...
                            kubectl rollout status deployment/fixmate-frontend -n ${K8S_NAMESPACE} --timeout=120s
                        """
                    }catch(err){
                        echo "Rollout failed, initiating rollback..."
                        sh """
                            kubectl rollout undo deployment/fixmate-frontend -n ${K8S_NAMESPACE}
                        """
                        error("Rollout verification failed, rolled back to previous version.")
                    }
                }
            }
        }
    }

    post {
		success {
			emailext (
				subject: "FixMate Frontend Deployment SUCCESS",
				body: """\
					Deployment Completed Successfully!

					Environment: Production (GKE)
					Image: ${NEW_IMAGE}

					FixMate frontend is now live.
					""",
				to: "janitha1717@gmail.com"
			)
		}

		failure {
			emailext (
				subject: "FixMate Frontend Deployment FAILED",
				body: """\
					Deployment Failed!

					Automatic rollback was executed.

					Check Jenkins console logs for detailed error.
					""",
				to: "janitha1717@gmail.com"
			)
		}
	}
}