#!/bin/bash -i

POSITIONAL=()

# processing command line parameters
while [[ $# -gt 0 ]]
do
    key="$1"
    case $key in
        -en|--environment-name)
        ENV_NAME="$2"
        shift # past argument
        shift # past value
        ;;
        *)    # unknown option
        POSITIONAL+=("$1") # save it in an array for later
        shift # past argument
        ;;
    esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

# Parse and validate parameters: POD_NAME
if [ -z "$ENV_NAME" ]; then
    echo 'No customized parameter for target environment is passed, using default value [CPQA2-VA1]'
    ENV_NAME='cpqa2-va1'
else
    echo "Target environment passed in is [$ENV_NAME]"
fi


source ~/.bashrc
cd /opt/jsat-e2e-chat-window/
nvm install 16.16.0
npm use 16.16.0
npm ci
echo "Done with npm ci command, start npx playwright install"
pwd
npx playwright install
SERVER=$ENV_NAME npx playwright test
test_result=$?
if [ "$test_result" -ne 0 ]; then
    echo 'jsat-e2e-chat-window tests returns non-zero code, indicating tests failed, exit right away with code 1'
    exit 1
fi
ls -al ~/.npm
if [ -d ~/.npm/_logs ]; then
  find ~/.npm/_logs *.log
  find ~/.npm/_logs *.log -exec cp "{}" . \;
fi
