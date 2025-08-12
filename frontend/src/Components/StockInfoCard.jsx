import { Grid, Text, Divider, Box, Paper } from '@mantine/core';

const StockInfoCard = ({ stock }) => {
    const currency = stock.currency === 'INR' ? '₹' : '$';
    const InfoRow = ({ label1, value1, label1Currency, label2, value2, label2Currency }) => (
        <>
            <Grid p={"10px 0 10px 0"}>
                <Grid.Col span={6}>
                    <Text size="sm" c="dimmed">{label1}</Text>
                    <Text fw={400}>{label1Currency && currency}{value1}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text size="sm" c="dimmed">{label2}</Text>
                    <Text fw={400}>{label2Currency && currency}{value2}</Text>
                </Grid.Col>
            </Grid>
            <Divider my="xs" />
        </>
    );

    return (
        <Paper p="md" radius="md" bg="transparent">
            <Text size="lg" fw={600} mb="sm">Stock Info</Text>

            <InfoRow label1="Open Price" value1={stock.open} label1Currency={true} label2="Day High" value2={stock.high} label2Currency={true} />
            <InfoRow label1="Day Low" value1={stock.low} label1Currency={true} label2="52-Week High" value2={stock.fiftyTwoWeekHigh} label2Currency={true} />
            <InfoRow label1="52-Week Low" value1={stock.fiftyTwoWeekLow} label1Currency={true} label2="Volume" value2={stock.volume} label2Currency={false} />
            <InfoRow label1="Market Cap" value1={stock.marketCap} label1Currency={true} label2="P/E Ratio" value2={stock.PERatio} label2Currency={false} />
            {/* <InfoRow label1="EPS" value1={stock.EPS} label2="Dividend Yield" value2={stock.dividendYield} /> */}
            {/* <InfoRow label1="Beta" value1={stock.beta} label2="Industry" value2={stock.industry || '—'} />
            <InfoRow label1="Sector" value1={stock.sector || '—'} label2="Business Description" value2={stock.info || '—'} /> */}
        </Paper>
    );
};

export default StockInfoCard;