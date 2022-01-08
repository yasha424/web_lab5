import { get } from 'svelte/store';
import { token } from '../store';

class RequestHelper {
    URL = another_uri;

    async fetchGraphQL(operationsDoc, operationName, variables) {
        const result = await fetch(this.URL, {
            method: "POST",
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName,
            }),
            headers: {
                Authorization: `Bearer ${get(token)}`,
            },
        });
        console.log(result.headers.Authorization);
        return await result.json();
    }

    FetchMyQuery(operationsDoc) {
        return this.fetchGraphQL(operationsDoc, "MyQuery", {});
    }

    async startFetchMyQuery(operationsDoc) {
        const { errors, data } = await this.FetchMyQuery(operationsDoc);

        if (errors) {
            console.error(errors);
            throw errors[0].message;
        }
        return data;
    }

    async startExecuteMyMutation(operationsDoc) {
        const { errors, data } = await this.fetchGraphQL(operationsDoc, "MyMutation", {});

        if (errors) {
            console.error(errors);
            throw errors[0].message;
        }
        return data;
    }
}

export default new RequestHelper();
