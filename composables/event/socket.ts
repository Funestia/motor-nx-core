import Pusher from "pusher-js";
import {ref, reactive} from "vue";
import {useUserStore} from "~/packages/motor-nx-core/store/user";
import {storeToRefs} from "pinia";

export default function useSocket() {

  const userStore = useUserStore();
  const {token} = storeToRefs(userStore);
  const client = ref<Pusher>(null);
  const events = reactive({
    nagivation: {
      updated: 'Motor\\Builder\\Events\\NavigationUpdated'
    },
    builderPage: {
      updated: 'Motor\\Builder\\Events\\BuilderPageUpdated',
      deleted: 'Motor\\Builder\\Events\\BuilderPageDeleted'
    },
    export: {
      created: 'export.created'
    }
  })

  const initialize = async () => {
    const PusherJS = Pusher;
    client.value = new PusherJS(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: '',
      authEndpoint: import.meta.env.VITE_PUBLIC_API_BASE_URL + 'api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: "Bearer " + token.value,
          'X-CSRF-TOKEN': 'testjawollo'
        }
      },
      wsHost: import.meta.env.VITE_PUSHER_HOST,
      wsPort: import.meta.env.VITE_PUSHER_PORT,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
    });
    console.log("Initialized Pusher", client.value);
  }

  return {
    client,
    initialize,
    events
  }
}