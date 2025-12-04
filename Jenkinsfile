pipeline{
    agent any

    options {
            timestamps()
            disableConcurrentBuilds()
            buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    environment {
        DOCKERHUB_USER = credentials('dockerhub-username')
        IMAGE_NAME = credentials('dockerhub-image-name-frontend')
        GCP_PROJECT		=	credentials('gcp-project-id')
		GKE_CLUSTER		=	credentials('gke-cluster-name')
		GKE_ZONE		=	credentials('gke-zone')
		K8S_NAMESPACE	=	credentials('k8s-namespace')

        NEW_IMAGE		=	"${DOCKERHUB_USER}/${IMAGE_NAME}:latest"
    }

    stages{
        stage('Checkout Code'){
            steps{
                checkout scm
            }
        }

        stage('')
    }
}