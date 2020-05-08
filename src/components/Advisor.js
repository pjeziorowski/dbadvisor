import React, { useState } from 'react';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';
import './Advisor.css'

const DatabasePicker = () => {
    const [database, setDatabase] = useState()
    const advisor = Machine({
        id: 'advisor',
        initial: 'relational',
        context: {
            question: "Is your data relational?"
        },
        states: {
            relational: {
                on: {
                    YES: {
                        target: 'postgresql'
                    },
                    NO: {
                        target: 'cache',
                        actions: assign({
                            question: "Do you need instant access to your data?"
                        })
                    }
                }
            },
            cache: {
                on: {
                    YES: 'redis',
                    NO: {
                        target: 'fullIndexSearch',
                        actions: assign({
                            question: "Do you need a full index search?"
                        })
                    }
                }
            },
            fullIndexSearch: {
                on: {
                    YES: 'elasticsearch',
                    NO: 'mongodb'
                }
            },
            redis: {
                entry: ['pickDatabase'],
                type: 'final'
            },
            mongodb: {
                entry: ['pickDatabase'],
                type: 'final'
            },
            elasticsearch: {
                entry: ['pickDatabase'],
                type: 'final'
            },
            postgresql: {
                entry: ['pickDatabase'],
                type: 'final'
            }
        },
    }, {
        actions: {
            pickDatabase: (event, context, meta) => {
                setDatabase(meta.state.value)
            }
        }
    });

    const [state, send] = useMachine(advisor);

    return (
        <div className="advisor">
            {!database && state.context && state.context.question && (
                <>
                    <h2>{state.context.question}</h2>
                    <div className="button-group">
                        <button className="button" onClick={() => send('NO')}>
                            No
                         </button>
                        <button className="button" onClick={() => send('YES')}>
                            Yes
                         </button>
                    </div>
                </>
            )}
            {database && (<h2>Your best choice is {database}</h2>)}
        </div>

    );
}

export default DatabasePicker;
