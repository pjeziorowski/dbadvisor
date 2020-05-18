import { Machine } from 'xstate';
import config from './dbSelectionMachineConfig'

const dbSelectionMachine = onSelect => Machine(
    config,
    {
        actions: {
            databaseSelected: (event, context, meta) => onSelect(meta.state.value)
        }
    }
);

export default dbSelectionMachine
