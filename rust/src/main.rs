use iota::Client;
// use tokio::time::{sleep, Duration};

// #[macro_use]
// extern crate dotenv_codegen;

#[tokio::main]
async fn main() {
    // let seed = dotenv!("IOTA_SEED");
    // println!("{}", seed);

    let message_index = "BC030";
    let iterations = 1000000;

    let iota = Client::builder() // Crate a client instance builder
        .with_node("https://chrysalis-nodes.iota.org") // "https://api.lb-0.testnet.chrysalis2.com")
        .unwrap()
        .finish()
        .await
        .unwrap();

    let info = iota.get_info().await.unwrap();
    println!("messages_per_second {}", info.nodeinfo.messages_per_second);
    // println!("{:#?}", info);

    println!("Send {} messages", iterations);

    println!(
        "https://explorer.iota.org/mainnet/indexed/{}",
        message_index
    );

    for iteration in 1..=iterations {
        let message = iota
            .message()
            .with_index(message_index)
            .with_data("forever young".as_bytes().to_vec())
            .finish()
            .await
            .unwrap();
        // println!("Message {:#?}", message);
        // println!("Message id {:#?}", message.id());
        println!(
            "https://explorer.iota.org/mainnet/message/{}",
            message.id().0
        );

        if iteration % 10 == 0 {
            let info = iota.get_info().await.unwrap();
            println!("messages_per_second {}", info.nodeinfo.messages_per_second);
        }

        // sleep(Duration::from_millis(10 * 1000)).await;
    }

    println!(
        "https://explorer.iota.org/mainnet/indexed/{}",
        message_index
    );
}
