/// The example showcases how to programmatically estimate transactions fee.
///

import { initialize, getDecimals, formatNumberToBalance } from "avail-js-sdk"

import config from "./config"

const main = async () => {
  const api = await initialize(config.endpoint)

  const sender = "5CMeo7G4KdCi5qCZBm7Qmus5QrsoT33sMnRgijMf9v4pENGE"
  const bobAddress = "5Cadi7gWo6RxtHsdAHmad4UTZCFUoKsQer1kLDfaN3E437Pi"
  const decimals = getDecimals(api)
  const amount = formatNumberToBalance(config.amount, decimals)

  const transferInfo = await api.tx.balances.transferKeepAlive(bobAddress, amount).paymentInfo(sender)
  // log relevant info, partialFee is Balance, estimated for current
  console.log(`Transaction Fee for Balance Transfer:
    class=${transferInfo.class.toString()},
    weight=${transferInfo.weight.toString()},
    partialFee=${transferInfo.partialFee.toHuman()}
  `)

  const data = "Hello World"
  const submitDataInfo = await api.tx.dataAvailability.submitData(data).paymentInfo(sender)
  // log relevant info, partialFee is Balance, estimated for current
  console.log(`Transaction Fee for Submit Data:
    class=${submitDataInfo.class.toString()},
    weight=${submitDataInfo.weight.toString()},
    partialFee=${submitDataInfo.partialFee.toHuman()}
  `)

  process.exit(0)
}
main()