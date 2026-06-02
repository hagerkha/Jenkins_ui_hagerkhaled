pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'hagerkhaled/jenkins-ui-hagerkhaled'
        DOCKER_TAG     = "${BUILD_NUMBER}"
        DOCKER_LATEST  = 'latest'
        DOCKER_CREDS   = 'dockerhub-credentials'
        CONTAINER_NAME = 'hagerkhaled-website-container'
        HOST_PORT      = '8090'
        CONTAINER_PORT = '80'
    }
    stages {
        stage('Checkout') {
            steps {
                echo '📥 سحب الكود من GitHub...'
                git branch: 'main',
                    url: 'https://github.com/hagerkha/Jenkins_ui_hagerkhaled.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                echo '🐳 بناء الـ Image...'
                sh """
                    docker build \
                        -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                        -t ${DOCKER_IMAGE}:latest \
                        .
                """
            }
        }
        stage('Push to Docker Hub') {
            steps {
                echo '📤 رفع الـ Image على Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE}:latest
                        docker logout
                    """
                }
            }
        }
        stage('Deploy') {
            steps {
                echo '🚀 تشغيل الـ Container...'
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        ${DOCKER_IMAGE}:${BUILD_NUMBER}
                """
            }
        }
        stage('Show URL') {
            steps {
                echo """
===============================
✅ Deployment Successful!
👉 Open: http://localhost:${HOST_PORT}
===============================
"""
            }
        }
    }
    post {
        success {
            echo '✅ Build نجح!'
        }
        failure {
            echo '❌ Build فشل - راجعي اللوج'
        }
    }
}
