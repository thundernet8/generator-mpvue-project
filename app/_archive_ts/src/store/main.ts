import { VuexStore } from '@gfe/wxapp-common-vue';

export default (function() {
    let store: VuexStore<any> = null as any;

    return function createStore() {
        const initialState = Object.assign(Object.create(null), {
            examples: []
        });
        if (!store) {
            store = new VuexStore({
                strict: process.env.NODE_ENV !== 'production',
                state: initialState,
                mutations: {
                    // examples
                    updateExamples(state, examples) {
                        state.examples = examples;
                    }
                }
            });
        }

        return store;
    };
})();
