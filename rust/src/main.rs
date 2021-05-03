use iota::Client;
// use tokio::time::{sleep, Duration};

// #[macro_use]
// extern crate dotenv_codegen;

#[tokio::main]
async fn main() {
    // let seed = dotenv!("IOTA_SEED");
    // println!("{}", seed);

    // loop {
    let iota = Client::builder() // Crate a client instance builder
        .with_node("https://chrysalis-nodes.iota.org") // "https://api.lb-0.testnet.chrysalis2.com")
        .unwrap()
        .finish()
        .await
        .unwrap();

    let info = iota.get_info().await.unwrap();
    println!("{:#?}", info);

    println!("Sending message...");
    let message = iota
        .message()
        .with_index("BC030")
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

    // sleep(Duration::from_millis(10 * 1000)).await;
    // }
}
