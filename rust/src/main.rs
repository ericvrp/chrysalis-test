use iota::Client;
// use tokio::time::{sleep, Duration};

// #[macro_use]
// extern crate dotenv_codegen;

#[tokio::main]
async fn main() {
    // let mnemonic = dotenv!("IOTA_MNEMONIC");
    // println!("{}", mnemonic);

    const NETWORK: &str = "mainnet";
    const NODE: &str = "https://chrysalis-nodes.iota.org"; // "https://api.lb-0.testnet.chrysalis2.com"

    let iota = Client::builder() // Crate a client instance builder
        .with_network(NETWORK)
        .with_node(NODE)
        .unwrap()
        .finish()
        .await
        .unwrap();

    // let info = iota.get_info().await.unwrap();
    // println!("{:#?}", info);

    const MESSAGE_INDEX: &str = "chrysalis-test";
    let mut last_messages_per_second = 0.0;

    loop {
        let info = iota.get_info().await.unwrap();

        if last_messages_per_second != info.nodeinfo.messages_per_second {
            last_messages_per_second = info.nodeinfo.messages_per_second;
            println!(
                "https://explorer.iota.org/{}/indexed/{} ({} MPS on {})",
                NETWORK, MESSAGE_INDEX, last_messages_per_second, NETWORK
            );
        }

        let message = iota
            .message()
            .with_index(MESSAGE_INDEX)
            .with_data("Hi chrysalis-test from Rust!!!".as_bytes().to_vec())
            .finish()
            .await
            .unwrap();
        // println!("Message {:#?}", message);
        // println!("Message id {:#?}", message.id());
        println!(
            "https://explorer.iota.org/{}/message/{}",
            NETWORK,
            message.id().0
        );

        // sleep(Duration::from_millis(10 * 1000)).await;
    }
}
