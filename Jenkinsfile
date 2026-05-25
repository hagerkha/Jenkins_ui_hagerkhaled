pipeline {
    agent any
    environment {
        DOCKER_IMAGE   = 'amirayasser2003/school-website'
        DOCKER_TAG     = "${BUILD_NUMBER}"
        DOCKER_LATEST  = 'latest'
        DOCKER_CREDS   = 'dockerhub-credentials'
        CONTAINER_NAME = 'school-website-container'
        HOST_PORT      = '9090'
        CONTAINER_PORT = '80'
    }
    stages {
        stage('Checkout') {
            steps {
                echo '📥 سحب الكود من GitHub...'
                git branch: 'main',
                    url: 'https://github.com/meroyasser222003-hue/Amira_Jenkins.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                echo '🐳 بناء الـ Image...'
                sh '''
                    docker build \
                        -t ''' + env.DOCKER_IMAGE + ':' + env.BUILD_NUMBER + ''' \
                        -t ''' + env.DOCKER_IMAGE + ''':latest \
                        .
                '''
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
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ''' + env.DOCKER_IMAGE + ':' + env.BUILD_NUMBER + '''
                        docker push ''' + env.DOCKER_IMAGE + ''':latest
                        docker logout
                    '''
                }
            }
        }
        stage('Deploy') {
            steps {
                echo '🚀 تشغيل الـ Container...'
                sh '''
                    docker stop school-website-container || true
                    docker rm school-website-container || true
                    docker run -d \
                        --name school-website-container \
                        --restart unless-stopped \
                        -p 9090:80 \
                        ''' + env.DOCKER_IMAGE + ':' + env.BUILD_NUMBER + '''
                '''
            }
        }
        stage('Show URL') {
            steps {
                echo '''
===============================
✅ Deployment Successful!
👉 Open: http://localhost:9090
===============================
'''
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
