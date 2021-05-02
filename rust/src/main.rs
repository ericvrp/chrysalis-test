use iota::Client;
use tokio::time::{sleep, Duration};
use dotenv::dotenv;
use std::env;

#[tokio::main]
async fn main() {
    loop {
        let iota = Client::builder() // Crate a client instance builder
            .with_node("https://chrysalis-nodes.iota.org") // "https://api.lb-0.testnet.chrysalis2.com")
            .unwrap()
            .finish()
            .await
            .unwrap();

        let info = iota.get_info().await.unwrap();
        println!("{} {:#?}", env::var("IOTA_SEED"), info);

        sleep(Duration::from_millis(10 * 1000)).await;
    }
}
