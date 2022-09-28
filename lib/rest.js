import axios from 'axios';
import { REACT_APP_API_PATH } from '@env';

const METHOD_WITH_DATA = ['post', 'put', 'patch'];

class Network {
    constructor(method, url) {
        this.url = url;
        this.method = method;
        this.controller = new AbortController();
        this.processing = false;
        this.args = [];
        this.url = REACT_APP_API_PATH;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    call(data, options) {
        let opt = { signal: this.controller.signal };
        console.log(arguments, arguments.length);
        switch (arguments.length) {
            case 0:
                this.args.push(
                    METHOD_WITH_DATA.includes(this.method)
                    ? ({}, opt)
                    : opt
                );
                break;
            case 1:
                this.args.push(
                    METHOD_WITH_DATA.includes(this.method)
                    ? (data, opt)
                    : Object.assign(data, opt)
                );
                break;
            case 2:
                this.args.push(
                    data,
                    Object.assign(options, opt)
                );
                break;
            default:
                throw Error('INVALID ARGUMENTS LENGHT');
        }
        

        return this;
    }

    subscribe() {
        return new Promise((resolve, reject) => {
            if (this.processing) {
                reject(new Error('STACKERROR You can\'t stack request'));
            }
            this.processing = true;
            console.log('[📡] -> Request [%s : %s]', this.method, this.url);
            axios[this.method](REACT_APP_API_PATH + this.url, ...this.args)
                .then((res) => {
                    console.log('[📡] <- Response [%s : %s]', this.method, this.url);
                    return res;
                })
                .then(resolve)
                .catch((err) => {
                    console.log('[📡] x- Response [%s : %s]', this.method, this.url);
                    return err;
                })
                .then(reject);
        })
    }

    unsubscribe() {
        if (this.controller instanceof AbortController) {
            this.controller.abort();
        }
        this.processing = false;
        console.log('[🎛️] -x Cleanup Request [%s : %s]', this.method, this.url);

        return this;
    }
}

export default {
    Network,
    HealthCheck: () => new Network('get', '/healthcheck'),
    users: {
        Get: () => new Network('get', '/users')
    },
    anotherApi: () => new Network('get', '/').setUrl('https://test.com')
}