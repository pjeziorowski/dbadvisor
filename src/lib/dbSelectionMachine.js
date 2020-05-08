import { Machine, assign } from 'xstate';

const dbSelectionMachine = onSelect => Machine({
    id: 'advisor',
    initial: 'isConsistencyCritical',
    context: {
        question: "Is data consistency critical?",
        answers: [{
            key: "YES",
            label: "It's very critical"
        },
        {
            key: "NO",
            label: "It's not critical"
        }],
        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
    },
    states: {
        isConsistencyCritical: {
            on: {
                YES: {
                    target: 'isDataStructured',
                    actions: assign({
                        question: "Is your data structured?",
                        answers: [{
                            key: "YES",
                            label: "Yes, it is"
                        },
                        {
                            key: "NO",
                            label: "No, it isn't"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
                NO: {
                    target: 'needFastCache',
                    actions: assign({
                        question: "Do you need a fast caching solution?",
                        answers: [{
                            key: "YES",
                            label: "Yes, I do"
                        },
                        {
                            key: "NO",
                            label: "No, I don't"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
            }
        },
        needFastCache: {
            on: {
                YES: "redis",
                NO: {
                    target: 'needFullIndexSearch',
                    actions: assign({
                        question: "Do you need full index search?",
                        answers: [{
                            key: "YES",
                            label: "Yes, I do"
                        },
                        {
                            key: "NO",
                            label: "No, I don't"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
            }
        },
        needFullIndexSearch: {
            on: {
                YES: "elasticsearch",
                NO: "mongodb"
            }
        },
        isDataStructured: {
            on: {
                YES: "postgresql",
                NO: "mongodb"
            }
        },
        redis: {
            entry: 'databaseSelected',
            type: 'final'
        },
        mongodb: {
            entry: 'databaseSelected',
            type: 'final'
        },
        elasticsearch: {
            entry: 'databaseSelected',
            type: 'final'
        },
        postgresql: {
            entry: 'databaseSelected',
            type: 'final'
        }
    },
}, {
    actions: {
        databaseSelected: (event, context, meta) => onSelect(meta.state.value)
    }
});

export default dbSelectionMachine
