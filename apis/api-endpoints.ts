// We are not supposed to use THRIFT and MDS against stg1 and prod.
export const API_ENDPOINTS = {
    MDS_ENDPOINT: {
        local: 'https://lb-msg-mds-qa.apps.ocp-dev-nvan.dev-globalrelay.net/admin/v2',
        cpqa2: 'https://lb-msg-mds-qa.apps.ocp-dev-nvan.dev-globalrelay.net/admin/v2',
        'cpqa2-pd1': 'https://lb-msg-mds-qa.apps.ocp-dev-nvan.dev-globalrelay.net/admin/v2',
        'cpqa2-pd2': 'https://lb-msg-mds-qa.apps.ocp-dev-nvan.dev-globalrelay.net/admin/v2',
        'cpqa2-va1': 'https://lb-msg-mds-qa.apps.ocp-dev-nvan.dev-globalrelay.net/admin/v2',
        'cpqa2-ca1': 'https://lb-msg-mds-qa.apps.ocp-dev-nvan.dev-globalrelay.net/admin/v2',
        'cpqa2-sq1': 'https://lb-msg-mds-qa.apps.ocp-dev-nvan.dev-globalrelay.net/admin/v2',
        cpqa1: 'https://lb-msg-mds-stable.apps.ocp-dev-nvan.dev-globalrelay.net/admin/v2'
    },
    SM_THRIFT_HOST: {
        local: 'lb-sm-cpqa2-nvan.dev-globalrelay.net',
        cpqa2: 'lb-sm-cpqa2-nvan.dev-globalrelay.net',
        'cpqa2-pd1': 'lb-sm-cpqa2-nvan.dev-globalrelay.net',
        'cpqa2-pd2': 'lb-sm-cpqa2-nvan.dev-globalrelay.net',
        'cpqa2-va1': 'lb-sm-cpqa2-nvan.dev-globalrelay.net',
        'cpqa2-ca1': 'lb-sm-cpqa2-nvan.dev-globalrelay.net',
        'cpqa2-sq1': 'lb-sm-cpqa2-nvan.dev-globalrelay.net',
        cpqa1: 'lb-sm-cpqa1-nvan.dev-globalrelay.net'
    },
    SM_THRIFT_PORT: {
        local: 7443,
        cpqa2: 7443,
        'cpqa2-pd1': 7443,
        'cpqa2-pd2': 7443,
        'cpqa2-va1': 7443,
        'cpqa2-ca1': 7443,
        'cpqa2-sq1': 7443,
        cpqa1: 7443
    },
    GAS_LOGIN_ENDPOINT: {
        local: 'https://cpqa2login.dev-globalrelay.net/main/json/v1',
        cpqa2: 'https://cpqa2login.dev-globalrelay.net/main/json/v1',
        'cpqa2-pd1': 'https://cpqa2login.dev-globalrelay.net/main/json/v1',
        'cpqa2-pd2': 'https://cpqa2login.dev-globalrelay.net/main/json/v1',
        'cpqa2-va1': 'https://cpqa2login.dev-globalrelay.net/main/json/v1',
        'cpqa2-ca1': 'https://cpqa2login.dev-globalrelay.net/main/json/v1',
        'cpqa2-sq1': 'https://cpqa2login.dev-globalrelay.net/main/json/v1',
        cpqa1: 'https://cpqa1portal.dev-globalrelay.net/main/json/v1'
    },
    GAS_SERVICE_URL: {
        local: 'https://portal.dev-globalrelay.net/portal/login',
        cpqa2: 'https://cpqa2portal.dev-globalrelay.net/portal/login',
        'cpqa2-pd1': 'https://lb3-portal-cpqa2-nvan.dev-globalrelay.net/portal/login',
        'cpqa2-pd2': 'https://lb4-portal-cpqa2-nvan.dev-globalrelay.net/portal/login',
        'cpqa2-va1': 'https://lb7-portal-cpqa2-nvan.dev-globalrelay.net/portal/login',
        'cpqa2-ca1': 'https://lb9-portal-cpqa2-nvan.dev-globalrelay.net/portal/login',
        'cpqa2-sq1': 'https://lb8-portal-cpqa2-nvan.dev-globalrelay.net/portal/login',
        cpqa1: 'https://cpqa1portal.dev-globalrelay.net/portal/login',
        prod: 'https://portal.globalrelay.com/portal/login',
        stg1: 'https://portalstg1.globalrelay.com/portal/login'
    }
};
