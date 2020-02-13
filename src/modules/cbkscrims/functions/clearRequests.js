export default function clearRequests(botmodule) {
  botmodule.requestsChannel.bulkDelete(100, true);
  botmodule.resources.requests = {};
  saveResources(botmodule);
}