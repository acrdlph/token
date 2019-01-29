const InflationaryToken = artifacts.require('InflationaryToken');

const { expect } = require('chai');

contract('PreInflationaryToken', accounts => {

    let preInflationaryToken;
    let retOwner;
    let retBalanceDistributor;

    const testName = "Relevant Token";
    const testDecimals = 18;
    const testSymbol = "RVT";
    const testVersion = "1.0";
    const testInitialSupply = 0;
    const testDistributor = accounts[0];
    const testInitBlockReward = 40;
    const testHalvingTime = 2102400; // block rewards halve after 1 year
    const testLastHalvingPeriod = 4; // block rewards stay constant after 5 * halvingTime

    // calculate total rewards to be preminted:
    let totalInflationRewards = null;
    let currBlockReward = testInitBlockReward;
    for (let i=0; i<testLastHalvingPeriod; i++) {
        totalInflationRewards += testHalvingTime * currBlockReward;
        currBlockReward /= 2;
    };

    before(async () => {
        preInflationaryToken = await InflationaryToken.new();
        expect(preInflationaryToken.address).to.exist;
        await preInflationaryToken.initialize(
            testName,
            testDecimals,
            testSymbol,
            testVersion,
            testInitialSupply,
            testDistributor,
            testInitBlockReward,
            testHalvingTime,
            testLastHalvingPeriod
        )
    });

    it('Returns expected parameters on initialization', async () => {
        // retInflationRate = await inflationaryToken.inflationRate();
        // expect(
        //     retInflationRate.toNumber()
        // ).to.equal(testInflationRate);
        retOwner = await preInflationaryToken.owner();
        expect(
            retOwner.toString()
        ).to.equal(accounts[0]);
    });

    it('Mints the initial supply', async () => {
        await preInflationaryToken.mintInitialSupply();
        retBalanceDistributor = await preInflationaryToken.balanceOf(testDistributor);
        expect(
            retBalanceDistributor.toNumber()
        ).to.equal(testInitialSupply);
    });

    it('Calculates and premints the total inflation rewards', async () => {
        await preInflationaryToken.preMintInflation();
        retBalanceDistributor = await preInflationaryToken.balanceOf(testDistributor);
        expect(
            retBalanceDistributor.toNumber()
        ).to.equal(totalInflationRewards);
    });
})

// TODO: add tests for upgradeability (https://docs.zeppelinos.org/docs/testing.html)
