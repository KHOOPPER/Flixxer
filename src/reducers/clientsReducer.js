export const initialState = {
    searchTerm: '',
    historyModal: { open: false, list: [], clientName: '' },
    confirm: { open: false, message: '', onConfirm: null },
    edit: { open: false, clientId: null, platId: null, monto: '', fechaInicio: '', mesesPagados: '' },
    renew: { open: false, clientId: null, platId: null, monto: '', mesesPagados: '', oldSub: null, platName: '' },
    addPlat: { open: false, clientId: null, platId: '', monto: '', mesesPagados: '', fechaInicio: new Date().toISOString().split('T')[0] },
    ticket: { open: false, client: null, subscription: null, plataforma: '', isFull: false },
    isSelectOpen: false,
    isDatePickerOpen: false
};

export function clientsReducer(state, action) {
    switch (action.type) {
        case 'SET_SEARCH': return { ...state, searchTerm: action.payload };
        case 'OPEN_HISTORY': return { ...state, historyModal: { open: true, list: action.payload.list, clientName: action.payload.name } };
        case 'CLOSE_HISTORY': return { ...state, historyModal: { ...state.historyModal, open: false } };
        case 'ASK_CONFIRM': return { ...state, confirm: { open: true, message: action.payload.msg, onConfirm: action.payload.fn } };
        case 'CLOSE_CONFIRM': return { ...state, confirm: { ...state.confirm, open: false } };
        case 'OPEN_EDIT': return { ...state, edit: { open: true, ...action.payload } };
        case 'CLOSE_EDIT': return { ...state, edit: { ...state.edit, open: false } };
        case 'SET_EDIT': return { ...state, edit: { ...state.edit, ...action.payload } };
        case 'OPEN_RENEW': return { ...state, renew: { open: true, ...action.payload } };
        case 'CLOSE_RENEW': return { ...state, renew: { ...state.renew, open: false } };
        case 'SET_RENEW': return { ...state, renew: { ...state.renew, ...action.payload } };
        case 'OPEN_ADD_PLAT': return { ...state, addPlat: { open: true, ...action.payload }, isSelectOpen: false };
        case 'CLOSE_ADD_PLAT': return { ...state, addPlat: { ...state.addPlat, open: false } };
        case 'SET_ADD_PLAT': return { ...state, addPlat: { ...state.addPlat, ...action.payload } };
        case 'OPEN_TICKET': return { ...state, ticket: { open: true, ...action.payload } };
        case 'CLOSE_TICKET': return { ...state, ticket: { ...state.ticket, open: false } };
        case 'TOGGLE_SELECT': return { ...state, isSelectOpen: !state.isSelectOpen };
        case 'SET_SELECT_OPEN': return { ...state, isSelectOpen: action.payload };
        case 'SET_DATE_PICKER_OPEN': return { ...state, isDatePickerOpen: action.payload };
        default: return state;
    }
}
