window.Framework = {
    config: {
        name: 'ThomasPrivateGenesysCloudEmbeddableFramework',

        clientIds: {
            'inindca.com': '26651c54-3429-4daf-b519-6b63445352da',
        },

        settings: {
            embedWebRTCByDefault: false,
            hideWebRTCPopUpOption: false,
            enableCallLogs: false,
            enableConfigurableCallerID: false,
            hideCallLogSubject: false,
            hideCallLogContact: false,
            hideCallLogRelation: false,
            enableTransferContext: false,
            enableServerSideLogging: false,
            searchTargets: ['people', 'queues', 'frameworkContacts'],
            dedicatedLoginWindow: false,
            enableGlobalLogout: true,
            disableInteractionDeallocationDelay: true,
            dedicatedLoginWindow: true,
            sso: {
                orgName: '',
                provider: '',
            },
             theme: {
                primary: '#0eb1edff',
                text: '#ef190aff',
             },
        },

        customInteractionAttributes: ['JS_GREETING'],

        helpLinks: {
            InteractionList: '',
            Dialpad: '',
            Callback: '',
            CallLog: '',
            QueueActivation: '',
            Settings: '',
        },

        getUserLanguage(callback) {
            callback('en-US');
        },
    },

    initialSetup() {
        // console.log('### [Child] Initial setup!');
        // window.PureCloud.User.getAuthToken((token) => {
        //     console.log('### [Child] Post a message to the parent:', { token });
        //     window.parent.postMessage({ token }, 'https://apps.inindca.com');
        // });
        // window.addEventListener('message', (event) => {
        //     if (event.data.type === 'embeddableFrameworkAPI') {
        //         console.log('### Framework.js received a message: ', event.data);
        //         const { methodName } = event.data;
        //         const parts = methodName.includes('.') ? methodName.split('.') : [methodName];
        //         let methodReference;
        //         parts.forEach((part) => {
        //             if (!methodReference) {
        //                 methodReference = window.PureCloud[part];
        //             } else {
        //                 methodReference = methodReference[part];
        //             }
        //         });
        //         methodReference?.(...event.data.methodArgs);
        //     }
        // });
        window.PureCloud.subscribe([
            {
                type: 'Interaction',
                callback(category, data) {
                    // console.log('### client event: ', category, interaction);
                    // window.parent.postMessage({ category, interaction }, '*');
                    console.log('### Interaction event: ', category, data);
                    const interactionId = (data && data.new && data.new.id) || (data && data.id) || null;
                    console.log('### Interaction event resolved interactionId: ', interactionId);
                    if (interactionId) {
                        window.parent.postMessage({ source: 'zapa-crm-genesys-framework', type: 'Interaction', category, interactionId }, '*');
                    }
                },
            },
            {
                type: 'Workitem',
                categories: ['added', 'updated', 'removed'],
                callback(category, data) {
                    console.log('### Workitem event: ', structuredClone({ category, data }));
                },
            },
            {
                type: 'Notification',
                categories: ['workitemSelection', 'interactionSelection'],
                callback(category, data) {
                    console.log('### Notification event: ', category, data);
                    if (category === 'interactionSelection') {
                        // data (currentSelection) has methods (e.g. getInteractionId()),
                        // which postMessage's structured clone can't carry across —
                        // resolve to a plain string here before sending.
                        const interactionId = data && typeof data.getInteractionId === 'function' ? data.getInteractionId() : null;
                        window.parent.postMessage({ source: 'zapa-crm-genesys-framework', type: 'Notification', category, interactionId }, '*');
                    }
                },
            },
            {
            type: 'UserAction',
                 callback(category, data) {
                     console.log('### client event: ', category, data);
                     window.parent.postMessage({ category, data }, '*');
                 },
             },
        ]);
    },

    screenPopWorkitem(workitem, callback) {
        console.log('### screenPopWorkitem: ', structuredClone(workitem));
        const field = workitem?.customFields?.url_pop_longtext;
        const url = typeof field === 'string' ? field : field?.value;
        if (url) {
            window.open(url, '_blank');
        }
        callback?.({});
    },

     screenPop(searchString, interaction, callback) {
         window.parent.postMessage({ type: 'screenPop', searchString, interaction }, '*');
     },

    // processCallLog(callLog, interaction, eventName, onSuccess, onFailure) {
    //     window.parent.postMessage({
    //         type: 'processCallLog', callLog, interaction, eventName,
    //     }, '*');

    //     setTimeout(() => {
    //         onSuccess({
    //             id: interaction.id,
    //         });
    //     }, 1000);
    // },

    // openCallLog(callLog) {
    //     window.parent.postMessage({
    //         type: 'openCallLog', callLog,
    //     }, '*');
    // },

    // contactSearch(searchValue, onSuccess, onFailure) {
    //     window.parent.postMessage({
    //         type: 'contactSearch', searchValue,
    //     }, '*');
    //     setTimeout(() => {
    //         onSuccess([{
    //             type: 'external',
    //             name: 'Weather Line',
    //             phone: [{
    //                 number: '(317) 222-2222',
    //                 label: 'Cell',
    //             }],
    //             attributes: { pt_urlpop: 'url' },
    //         }]);
    //     }, 1000);
    // },
};
