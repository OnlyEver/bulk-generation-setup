"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardData = getCardData;
const cardResponse = {
    _id: {
        $oid: "678a1b7ab2ad3f730b0f90f6",
    },
    id: "batch_req_678a1a75c45881908862ad38f85ca5e9",
    custom_id: {
        source: "6753b20a56e5e922b58273d6",
        request_type: {
            type: "depth",
            n: 1,
            bloom_level: 1,
        },
    },
    response: {
        status_code: 200,
        request_id: "2be51fb8de5c3d8b7f0730443c435912",
        body: {
            id: "chatcmpl-AqcEFqaHd0CDwSM8E8hy4EgUn7F4b",
            object: "chat.completion",
            created: 1737103371,
            model: "gpt-4o-mini-2024-07-18",
            choices: [
                {
                    index: 0,
                    message: {
                        role: "assistant",
                        content: '{"test_cards":[{"type":"cloze","card_content":{"prompt":"A **license** is an official permission or {{permit}} to do, use, or own something.","correct_options":["permit"],"incorrect_options":["license","agreement"],"explanation":"A license acts as an official permission, allowing individuals to engage in activities that might typically require authorization."},"concepts":["license"],"facts":["A license is an official permission or permit to do, use, or own something."]},{"type":"cloze","card_content":{"prompt":"A license is granted by a party (licensor) to another party ({{licensee}}) as an element of an agreement.","correct_options":["licensee"],"incorrect_options":["contractor","provider"],"explanation":"In licensing agreements, the licensor provides the licensee with permission to perform certain actions, often tied to legal terms."},"concepts":["licensor","licensee"],"facts":["A license is granted by a party (licensor) to another party (licensee) as an element of an agreement."]},{"type":"flash","card_content":{"front":"What is a key difference between a license and a lease?","back":"A license allows non-assignable privilege without granting any possessory interest, while a lease typically does grant possessory rights.","explanation":"Understanding distinctions between license and lease is crucial in property law, as it affects rights and legal standing."},"concepts":["license","lease"],"facts":["A key distinction between licenses and leases is that a license grants the licensee a revocable non-assignable privilege."]},{"type":"mcq","card_content":{"prompt":"What may a license require when issued by authorities?","choices":[{"choice":"Paying a fee","is_correct":true},{"choice":"Verifying capability","is_correct":true},{"choice":"Having a contract","is_correct":false},{"choice":"Registering a trademark","is_correct":false}],"explanation":"Licenses often require a fee and proof of qualification, ensuring compliance and control over the licensed activity."},"concepts":["license"],"facts":["A license may require paying a fee or proving a capability (or both)."]},{"type":"match","card_content":[{"left_item":"Term","right_item":"Length of time a license is valid"},{"left_item":"Territory","right_item":"Geographical scope of the license"},{"left_item":"Licensor","right_item":"Party granting the license"},{"left_item":"Licensee","right_item":"Party receiving the license"}],"concepts":["license","licensor","licensee"],"facts":["A license may stipulate what territory the rights pertain to.","A license is valid for a particular length of time."]},{"type":"cloze","card_content":{"prompt":"Intellectual property licensing gives the licensee rights to use or copy something without the risk of {{infringement}}.","correct_options":["infringement"],"incorrect_options":["prosecution","trespass"],"explanation":"Licenses protect licensees from legal claims regarding copyright or patent infringement by granting them the right to use specified intellectual property."},"concepts":["intellectual property","license"],"facts":["A license under intellectual property commonly has several components beyond the grant itself."]},{"type":"flash","card_content":{"front":"What is the role of royalty payments in patent licensing?","back":"Royalty payments compensate the patent owner and can be in lump sum or running royalty forms based on product sales.","explanation":"Royalty payments ensure that intellectual property owners receive fair compensation, which incentivizes innovation and legal use."},"concepts":["patent licensing"],"facts":["Patent owners may grant permission to others to engage in conduct that would otherwise be within the scope of a patent."]},{"type":"mcq","card_content":{"prompt":"What is valid under a pure licensing agreement?","choices":[{"choice":"Licensor can cancel the agreement at will","is_correct":true},{"choice":"Licensee gains possessory interest","is_correct":false},{"choice":"Licensor cannot revoke without cause","is_correct":false},{"choice":"Revocation always requires notice","is_correct":false}],"explanation":"Pure licensing agreements allow licensors to revoke at will unless specified otherwise, which is fundamental to understanding licensing."},"concepts":["termination","license"],"facts":["Under a pure licensing agreement, the licensor can cancel the agreement at will."]},{"type":"cloze","card_content":{"prompt":"Mass distributed software typically requires an {{end-user license agreement}} (EULA) for installation and use.","correct_options":["end-user license agreement"],"incorrect_options":["maintenance contract","software permit"],"explanation":"The EULA outlines the obligations and rights of both software developers and users, formalizing the usage permissions."},"concepts":["mass licensing of software"],"facts":["Mass distributed software is used by individuals on personal computers under license from the developer."]},{"type":"flash","card_content":{"front":"What is trademark licensing?","back":"Trademark licensing allows a licensee to use a trademark with permission from the licensor, protecting against infringement claims.","explanation":"Trademark licensing ensures that the licensee can operate using the trademark while adhering to the standards set by the licensor."},"concepts":["trademark licensing"],"facts":["A licensor may grant permission to a licensee to distribute products under a trademark."]},{"type":"cloze","card_content":{"prompt":"In the UK, prisoners are released \\"on {{licence}}\\", agreeing to maintain conditions set by authorities.","correct_options":["licence"],"incorrect_options":["parole","bond"],"explanation":"The concept of release \'on licence\' serves to monitor released inmates and ensure compliance with conditions for early release."},"concepts":["criminal law"],"facts":["In the United Kingdom prisoners serving a determinate sentence will be released prior to the full sentence \'on licence\'."]},{"type":"mcq","card_content":{"prompt":"What are two forms of royalty payments for patent licenses?","choices":[{"choice":"Flat fee","is_correct":false},{"choice":"Lump sum","is_correct":true},{"choice":"Running royalty","is_correct":true},{"choice":"Monthly payment plan","is_correct":false}],"explanation":"Understanding the two forms of royalty payments helps IP owners plan their revenue models effectively."},"concepts":["patent licensing"],"facts":["Patent owners may require a licensee to pay money in exchange for granting a patent license."]},{"type":"cloze","card_content":{"prompt":"The license creates a non-assignable privilege to act upon the land of the {{licensor}}.","correct_options":["licensor"],"incorrect_options":["tenant","lessor"],"explanation":"Recognizing the roles of licensor and licensee is essential to understanding property laws and rights."},"concepts":["license","licensor"],"facts":["A license provides one party with the authority to act on another\'s land."]}]}',
                        refusal: null,
                    },
                    logprobs: null,
                    finish_reason: "stop",
                },
            ],
            usage: {
                prompt_tokens: 4820,
                completion_tokens: 1430,
                total_tokens: 6250,
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
function getCardData() {
    //   return cardResponse;
    return {
        batch_id: cardResponse.id,
        request_id: {
            _source: cardResponse.custom_id.source,
            request_type: cardResponse.custom_id.request_type,
        },
        response: cardResponse.response.body,
    };
}
//# sourceMappingURL=temp_card_gen_data.js.map