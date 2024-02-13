// We are not supposed to use THRIFT and MDS against stg1 and prod.
export const API_ENDPOINTS = {
    CORE_ENDPOINT: {
        local: 'https://lb-msg-cpqa2-nvan.dev-globalrelay.net:9443/core/v1',
        cpqa2: 'https://lb-msg-cpqa2-nvan.dev-globalrelay.net:9443/core/v1',
        'cpqa2-pd1': 'https://lb-msg-cpqa2-nvan.dev-globalrelay.net:9443/core/v1',
        'cpqa2-pd2': 'https://lb-msg-cpqa2-nvan.dev-globalrelay.net:9443/core/v1',
        'cpqa2-va1': 'https://lb-msg-cpqa2-nvan.dev-globalrelay.net:9443/core/v1',
        'cpqa2-ca1': 'https://lb-msg-cpqa2-nvan.dev-globalrelay.net:9443/core/v1',
        'cpqa2-sq1': 'https://lb-msg-cpqa2-nvan.dev-globalrelay.net:9443/core/v1',
        cpqa1: 'https://lb-msg-cpqa1-nvan.dev-globalrelay.net:9443/core/v1'
    },
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
        cpqa1: 'https://cpqa1login.dev-globalrelay.net/main/json/v1'
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
    },
    SMS_GATEWAY: {
        //currently not in use
        local: 'https://msgsms-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        cpqa2: 'https://msgsms-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        'cpqa2-pd1': 'https://msgsms-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        'cpqa2-pd2': 'https://msgsms-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        'cpqa2-va1': 'https://msgsms-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        'cpqa2-ca1': 'https://msgsms-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        'cpqa2-sq1': 'https://msgsms-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        cpqa1: 'https://msgsms-stable.apps.ocp-dev-nvan.dev-globalrelay.net'
    },
    SMS_GATEWAY_WIREMOCK: {
        //currently not in use
        local: 'https://wiremockhost-sms-gateway-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        cpqa2: 'https://wiremockhost-sms-gateway-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        'cpqa2-pd1': 'https://wiremockhost-sms-gateway-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        'cpqa2-pd2': 'https://wiremockhost-sms-gateway-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        'cpqa2-va1': 'https://wiremockhost-sms-gateway-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        'cpqa2-ca1': 'https://wiremockhost-sms-gateway-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        'cpqa2-sq1': 'https://wiremockhost-sms-gateway-qa.apps.ocp-dev-nvan.dev-globalrelay.net',
        cpqa1: 'https://wiremockhost-sms-gateway-stable.apps.ocp-dev-nvan.dev-globalrelay.net'
    },
    CASSANDRA_CONTACT_POINTS: {
        //currently not in use
        local: 'cass1-msg-int-nvan.dev-globalrelay.net',
        cpqa2: 'cass1-msg-int-nvan.dev-globalrelay.net',
        'cpqa2-pd1': 'cass1-msg-int-nvan.dev-globalrelay.net',
        'cpqa2-pd2': 'cass1-msg-int-nvan.dev-globalrelay.net',
        'cpqa2-va1': 'cass1-msg-int-nvan.dev-globalrelay.net',
        'cpqa2-ca1': 'cass1-msg-int-nvan.dev-globalrelay.net',
        'cpqa2-sq1': 'cass1-msg-int-nvan.dev-globalrelay.net',
        cpqa1: 'cass1-msg-cpqa1-nvan.dev-globalrelay.net'
    },
    CASSANDRA_KEYSPACE: {
        //currently not in use
        local: 'sms_gateway_cpqa2',
        cpqa2: 'sms_gateway_cpqa2',
        'cpqa2-pd1': 'sms_gateway_cpqa2',
        'cpqa2-pd2': 'sms_gateway_cpqa2',
        'cpqa2-va1': 'sms_gateway_cpqa2',
        'cpqa2-ca1': 'sms_gateway_cpqa2',
        'cpqa2-sq1': 'sms_gateway_cpqa2',
        cpqa1: 'sms_gateway_cpqa1'
    },
    CASSANDRA_LOCAL_DATACENTER: {
        //currently not in use
        local: 'datacenter1',
        cpqa2: 'datacenter1',
        'cpqa2-pd1': 'datacenter1',
        'cpqa2-pd2': 'datacenter1',
        'cpqa2-va1': 'datacenter1',
        'cpqa2-ca1': 'datacenter1',
        'cpqa2-sq1': 'datacenter1',
        cpqa1: 'datacenter1'
    }
};
