def imageMap = [
  "development": "staging",
  "master": "latest"
]

def environmentNameMap = [
  "master": "production",
  "development": "staging"
]

def tag = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
def environmentName = environmentNameMap[env.BRANCH_NAME]

def tempBackendImage = "harbor.con2.fi/con2/edegal:${tag}"
def finalBackendImage = "harbor.con2.fi/con2/edegal:${imageMap[env.BRANCH_NAME]}"

def frontendImage = "harbor.con2.fi/con2/edegal-frontend:${tag}"

def tempStaticImage = "harbor.con2.fi/con2/edegal-static:${tag}"
def finalStaticImage = "harbor.con2.fi/con2/edegal-static:${imageMap[env.BRANCH_NAME]}"


node {
  stage("Build") {
    checkout scm
    sh "cd backend && docker build --tag $tempBackendImage ."
    sh "cd frontend && docker build --tag $frontendImage ."
    sh "cd frontend && docker build --file Dockerfile.static --build-arg FRONTEND_IMAGE=$frontendImage --build-arg BACKEND_IMAGE=$tempBackendImage --tag $tempStaticImage ."
  }

// stage("Test") {
//   node {
//     sh """
//       docker run \
//         --rm \
//         --link jenkins.conikuvat.fi-postgres:postgres \
//         --env-file ~/.edegal.env \
//         $tempBackendImage \
//         python manage.py test --keepdb
//     """
//   }
// }

  stage("Push") {
    sh """
      docker tag $tempBackendImage $finalBackendImage && \
        docker push $finalBackendImage && \
        docker push $tempBackendImage && \
        docker rmi $tempBackendImage && \

      docker tag $tempStaticImage $finalStaticImage && \
        docker push $finalStaticImage && \
        docker push $tempStaticImage && \
        docker rmi $tempStaticImage
    """
  }

  stage("Setup") {
    if (env.BRANCH_NAME == "development") {
      sh """
        kubectl delete job/setup \
          -n conikuvat-${environmentName} \
          --ignore-not-found && \
        emrichen kubernetes/jobs/setup.in.yml \
          -f kubernetes/${environmentName}.vars.yml \
          -D edegal_tag=${tag} | \
        kubectl apply -n conikuvat-${environmentName} -f -
      """
    }
  }

  stage("Deploy") {
    if (env.BRANCH_NAME == "development") {
      // Kubernetes deployment
      sh """
        emrichen kubernetes/template.in.yml \
          -f kubernetes/${environmentName}.vars.yml \
          -D edegal_tag=${tag} | \
        kubectl apply -n conikuvat-${environmentName} -f -
      """
    } else {
      // Legacy deployment
      sh """
        cd frontend \
          && rm -rf build \
          && mkdir build \
          && docker run --rm $finalStaticImage tar -C /usr/share/nginx -c html/ | tar -x -C build/ --strip-components=1 \
          && rsync -avH --chown root:conikuvat build/ root@nuoli.tracon.fi:/srv/conikuvat.fi/public_html
      """

      git url: "git@github.com:tracon/ansible-tracon"
      sh """
        ansible-playbook \
          --vault-password-file=~/.vault_pass.txt \
          --user root \
          --limit nuoli.tracon.fi \
          --tags edegal-deploy \
          tracon.yml
      """
    }
  }
}
