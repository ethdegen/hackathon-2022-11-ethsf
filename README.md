# 🤖 Social Network Decentralizer

#### Take back control of your profile and your influence. We restore your powers by extricating you from dangerous centralized social networks to the Lens Protocol with a single click!

<p align="center">
<img src="https://raw.githubusercontent.com/huwang12138/markdown-picture/main/icon.png" alt="icon" width="30%"/>
</p>

# 🔨 How to use

Launch the project in VS Code with `F1 -> Reopen In Container` followed by `Cmd+Shift+B` (Mac) or `Ctrl+Shift+B`
(other platforms).

# 🎤 Detailed Description

Centralized social networks are widely regarded as dangerous and exploitative. Decentralized social networks such as the Lens Protocol represent a fairer and brighter future.

Taking the first step in transitioning from a centralized to decentralized social network is the hardest. We demolish these barriers to make the first and only step as easy as pie.

Notion has risen to prominence thanks to the Notion teens whose lives are practically on the platform. For our hack, we built a one-click solution to free their social media from Notion and encode it the Right Way -- as an NFT via the Lens Protocol.

Along the way, we incorporated some amazing value-adds:

Social media metadata is stored safely in Filecoin via Web3.storage -- a far cry from the opaque databases of centralized social media where such data is often censored against the wishes of their posters yet ironically abused by the platforms for fun and profit.

Video assets are optimized via the cost-effective Livepeer Protocol and safekept on the decentralized platform. We also hoped to leverage Livepeer's IPFS-based storage capability but we unfortunately run into some snags with that API.

We picked Notion as the centralized social network on which to prototype our solution. Notion has a pleasant API and the platform, at least as of today, permits pretty comprehensive access to assets.

Notion teens are fortunate to enjoy a centralized closed-source product that has not _yet_ turned evil. History has proven that it is naive to assume any platform will remain benevolent into eternity. These teens should extricate their valuable assets while they still can, before all control and power is lost!

We trust they will enjoy the one-click Social Network Decentralizer :)

# ⚙️ The Process of Building this Project

Given that we only have (had?) 36 hours, our implementation embodies a reasonably simple flow of data.

1. We use the Notion API to pull a Notion page. We parse the content on the page ("blocks" in Notion parlance) to extract text, image & video data.

2. Video data is pre-processed using Livepeer. We feed the "raw" video URLs to Livepeer, and obtain optimized video URLs in return. For content creators and influencers, video optimization provides the best user experience and ultimately maximal conversion. Because Livepeer takes a not-insignificant amount of time to optimize, we needed to implement a teeny-weeny job "framework" that permits our front-end to initiate the optimization process and poll for completion. We frame this workflow as "content preparation" from a UX perspective.

3. Once all the required data has been obtained by the front-end, including URLs of the optimized videos, we are ready to liberate and decentralize the content!! This next phase of the workflow _must_ execute on the frontend because we need to sign stuff with the wallet!! Here, we made an attempt to adopt the Tenderly cloud wallet, which provides an ideal onboarding experience for Notion teens. While Tenderly's API is straightforward, we sadly ran out of time to really integrate it.

4. We treat each Notion page block as a Lens Protocol post, with a small exception for contiguous text blocks that we merge together based on headings. For each block, we generate Lens Protocol Metadata and upload the Metadata JSON to Filecoin using Web3.service. Ideally, we would want to use the Web3.service to place all content into IPFS/Filecoin and we would absolutely consider doing so with more time and in future projects! We were bitten quite hard by a recent bug in Babel (it can be Googled if anyone's interested), which made us unable to adopt the Web3.service JavaScript SDK. Nevertheless, we were able to integrate with its REST API in no time at all. Using IPFS URLs for Metadata seems like a great fit with Lens Protocol. Web3.service and Lens Protocol together feel like powerful combination!

5. As a decentralized "platform", Lens Protocol itself checks all the boxes in terms of what an ideal social network should look like! We create Lens Protocol Posts using the gasless approach on Polygon Mumbai. While there are undoubtedly other considerations when transacting on Polygon Mainnet, the Lens Protocol ecosystem and gasless approach felt comprehensive in supporting a diversity of use cases and technical platforms.

6. Finally, we have a basic user experience to retrieve publications owned by a Lens Profile. We used this facility primarily to verify that the postings were successful and the IPFS URIs in Post Metadata were valid. Lens Protocol offers a variety of publication types but for this hackathon we only had a chance to play with Posts.

As a logistical concern, we had to worry about creating Lens Profiles for newly-onboarded wallets. We take a simple approach of executing the Lens Sign-On process early in the user journey and "upsert"ing a basic profile if the wallet does not yet contain any. We absolutely envision a better-refined user experience on our next iteration!
