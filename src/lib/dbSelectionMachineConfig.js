import { assign } from 'xstate'

export default {
    id: 'advisor',
    initial: 'needsToStoreBlobs',
    context: {
        question: "Do you need to store BLOBs?",
        answers: [{
            key: "YES",
            label: "Yes"
        },
        {
            key: "NO",
            label: "No"
        }],
        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
    },
    states: {
        needsToStoreBlobs: {
            on: {
                YES: {
                    target: 'awsS3'
                },
                NO: {
                    target: 'whatsYourDataStructure',
                    actions: assign({
                        question: "What's your data structure?",
                        answers: [{
                            key: "STRUCTURED",
                            label: "Structured data"
                        },
                        {
                            key: "UNSTRUCTURED",
                            label: "Unstructured data"
                        },
                        {
                            key: "KEY_VALUE",
                            label: "Simple key-value data"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
            }
        },
        whatsYourDataStructure: {
            on: {
                STRUCTURED: {
                    target: 'isYourDataRelational',
                    actions: assign({
                        question: "Is your data relational?",
                        answers: [{
                            key: "NO_JOINS",
                            label: "No joins"
                        },
                        {
                            key: "A_FEW_JOINS",
                            label: "A few joins"
                        },
                        {
                            key: "TONS_OF_JOINS",
                            label: "Tons of joins"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
                UNSTRUCTURED: {
                    target: 'doYouNeedFullIndexSearch',
                    actions: assign({
                        question: "Do you need a full index search?",
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
                KEY_VALUE: 'redis'
            }
        },
        isYourDataRelational: {
            on: {
                NO_JOINS: {
                    target: 'howMuchDataToStoreWithoutJoins',
                    actions: assign({
                        question: "How much data you need to store?",
                        answers: [{
                            key: "TONS",
                            label: "Tons"
                        },
                        {
                            key: "LITTLE",
                            label: "Little"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
                A_FEW_JOINS: {
                    target: 'howMuchDataToStoreWithAFewJoins',
                    actions: assign({
                        question: "How much data you need to store?",
                        answers: [{
                            key: "TONS",
                            label: "Tons"
                        },
                        {
                            key: "Little",
                            label: "Little"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
                TONS_OF_JOINS: {
                    target: 'mongodb'
                }
            }
        },
        howMuchDataToStoreWithAFewJoins: {
            on: {
                TONS: {
                    target: 'isConsistencyImportantWithAFewJoins',
                    actions: assign({
                        question: "Is consistency important?",
                        answers: [{
                            key: "YES",
                            label: "Yes"
                        },
                        {
                            key: "No",
                            label: "No"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
                LITTLE: {
                    target: 'postgresql',
                }
            }
        },
        howMuchDataToStoreWithoutJoins: {
            on: {
                TONS: {
                    target: 'isConsistencyImportantWithNoJoins',
                    actions: assign({
                        question: "Is consistency important?",
                        answers: [{
                            key: "YES",
                            label: "Yes"
                        },
                        {
                            key: "No",
                            label: "No"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
                LITTLE: {
                    target: 'consistencyOrPerformance',
                    actions: assign({
                        question: "Do you prefer consistency or performance?",
                        answers: [{
                            key: "CONSISTENCY",
                            label: "Consistency"
                        },
                        {
                            key: "PERFORMANCE",
                            label: "Performance"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
            }
        },
        isConsistencyImportantWithNoJoins: {
            on: {
                YES: {
                    target: 'cockroachdb',
                    NO: {
                        target: 'doYouMainlyWriteOrRead',
                        actions: assign({
                            question: "Do you mainly write or read?",
                            answers: [{
                                key: "WRITE",
                                label: "Write"
                            },
                            {
                                key: "READ",
                                label: "Read"
                            }],
                            hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                        })
                    },
                }
            }
        },
        doYouNeedFullIndexSearch: {
            on: {
                YES: 'elasticsearch',
                NO: {
                    target: 'doYouNeedAGraphDatabase',
                    actions: assign({
                        question: "Are relations in your data model the most important?",
                        answers: [{
                            key: "YES",
                            label: "Yes"
                        },
                        {
                            key: "NO",
                            label: "No"
                        }],
                        hint: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus."
                    })
                },
            }
        },
        doYouMainlyWriteOrRead: {
            on: {
                WRITE: 'cassandra',
                READ: 'mongodb'
            }
        },
        consistencyOrPerformance: {
            on: {
                CONSISTENCY: 'postgresql',
                PERFORMANCE: 'redis'
            }
        },
        isConsistencyImportantWithAFewJoins: {
            on: {
                YES: "cockroachdb",
                NO: "mongodb"
            }
        },
        doYouNeedAGraphDatabase: {
            on: {
                YES: 'neo4j',
                NO: 'mongodb'
            }
        },
        redis: {
            entry: 'databaseSelected',
            type: 'final'
        },
        neo4j: {
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
        },
        cassandra: {
            entry: 'databaseSelected',
            type: 'final'
        },
        awsS3: {
            entry: 'databaseSelected',
            type: 'final'
        },
        cockroachdb: {
            entry: 'databaseSelected',
            type: 'final'
        }
    }
}
