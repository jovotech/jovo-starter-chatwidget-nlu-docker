# Jovo Docker Example

A sample repository that contains:

- `app`: A conversational backend built with the [Jovo Framework](https://github.com/jovotech/jovo-framework)
- `chatwidget`: A Vue.js chatwidget that interacts with the conversational backend
- `snips-nlu-server`: An open source natural language understanding (NLU) service


## Getting Started

´´´sh
$ git clone https://github.com/jovotech/jovo-docker-example.git
$ cd jovo-docker-example

# Download snips-nlu-server submodule from https://github.com/jovotech/snips-nlu-server
$ git submodule update --init --recursive

# Start Docker container
$ docker-compose -f docker-compose.jovo.snips.yml up
```