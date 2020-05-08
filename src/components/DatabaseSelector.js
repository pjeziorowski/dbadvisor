import React, { useState } from 'react';
import { useMachine } from '@xstate/react';
import dbSelectionMachine from '../lib/dbSelectionMachine'
import './DatabaseSelector.css'

const DatabaseSelector = () => {
    const [database, setDatabase] = useState()
    const [state, send] = useMachine(dbSelectionMachine(setDatabase));

    const answerButtons = state.context.answers.map(answer => (
        <button key={answer.key} className="button" onClick={() => send(answer.key)}>
            {answer.label}
        </button>
    ))

    return (
        <div className="advisor">
            {!database && state.context && state.context.question && (
                <>
                    <div>
                        <h2>{state.context.question}</h2>
                    </div>
                    <div className="hint">
                        <p>Hint:</p>
                        <p>{state.context.hint}</p>
                    </div>
                    <div className="button-group">
                        {answerButtons}
                    </div>
                </>
            )}
            {database && (<h2>Your best choice is {database}</h2>)}
        </div>
    );
}

export default DatabaseSelector;
