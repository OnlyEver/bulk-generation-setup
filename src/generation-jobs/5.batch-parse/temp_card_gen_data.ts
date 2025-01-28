export const getCardData = () => {
  return {
    _id: {
      $oid: "6797d7addef0c01fc1620ce8",
    },
    id: "batch_req_6797d51cc1b48190b643de1d65cfebf4",
    custom_id:
      '{"_source":"6753b1537d070c44eced81d3","request_type":{"type":"depth","n":1,"bloom_level":1}}',
    response: {
      status_code: 200,
      request_id: "e0c1966df304c98270d5c6f8623ea58b",
      body: {
        id: "chatcmpl-AuOM3mtWHoc3QWXGrriGf6Tu4BSFc",
        object: "chat.completion",
        created: 1738003351,
        model: "gpt-4o-mini-2024-07-18",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content:
                '{"type":"cloze","card_content":{"prompt":"Amdo Tibetan is spoken in {{Qinghai}}, {{Ngawa}}, and {{Gannan}} regions.","correct_options":["Qinghai","Ngawa","Gannan"],"incorrect_options":["Sichuan","Tibet","Yunnan"],"explanation":"Amdo Tibetan is a Tibetic language spoken primarily within the regions of Qinghai, Ngawa, and Gannan, which are located in China. This highlights the geographical focus where this language is prevalent."},"concepts":["Amdo Tibetan is a Tibetic language branch.","Amdo Tibetan is spoken in Qinghai, Ngawa, and Gannan."],"facts":["Amdo Tibetan is spoken in Qinghai, Ngawa, and Gannan."]}\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \r\n \n \n\n \n \n\n \n \n \n\n\n \n\n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n\n \n\n \n \n\n \n \n\n \r\n \n\n \n \n\n \n \n\n\n \n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n  \n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \r\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \r\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n \n \n\n\n \n\n \n \n\n \n \n\n \n \n \n\n\n\n\n \n\n\n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n\n \n\n\n\n  \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n  \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n \n \n\n\n \n\n\n\n \n \n\n\n \n\n\n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n  \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n \n\n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n \n\n \n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n \n\n\n \n\n \n \n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n\n \n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n\n\n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n \n\n\n\n \n \n\n \n \n\n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n \n\n\n \n\n \n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n\n\n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n\n\n\n \n \n\n\n \n\n \n \n\n\n\n \n \n\n \n \n\n\n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n  \n\n\n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n\n \n\n \n \n\n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n\n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n\n   \n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n\n\n\n \n\n\n \n\n\n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n\n  \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n\n \n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n\n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n\n \n\n\n \n\n\n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n  \n \n\n \n \n\n \n \n\n \n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n  \n\n  \n \n\n \n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n  \n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n\n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n  \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n\n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n\n \n \n\n \r\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n\n  \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n\n\n\n\n \n\n \n \n\n \n \n\n                                          \n \n\n\n                    \n           \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n\n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n\n\n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n \n \n\n\n  ',
              refusal: null,
            },
            logprobs: null,
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: 2961,
          completion_tokens: 5501,
          total_tokens: 8462,
          prompt_tokens_details: {
            cached_tokens: 0,
            audio_tokens: 0,
          },
          completion_tokens_details: {
            reasoning_tokens: 0,
            audio_tokens: 0,
            accepted_prediction_tokens: 0,
            rejected_prediction_tokens: 0,
          },
        },
        service_tier: "default",
        system_fingerprint: "fp_72ed7ab54c",
      },
    },
    error: null,
  };
};
