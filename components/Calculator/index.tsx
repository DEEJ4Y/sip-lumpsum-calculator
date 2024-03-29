import {
  Badge,
  Container,
  Grid,
  RingProgress,
  Space,
  Text,
} from "@mantine/core";
import { useState } from "react";
import CalculatorSectionInputGroup from "./InputGroup";
import useWindowSize from "@/hooks/useWindowSize";
import CalculatorSectionDataDisplayGroup from "./DataDisplayGroup";

export default function CalculatorSection() {
  const [calculatorState, setCalculatorState] = useState({
    lumpsum: 100000,
    sip: 10000,
    timeInYears: 10,
    estimatedReturns: 10,
  });

  const changeHandler =
    (stateKey: "lumpsum" | "sip" | "timeInYears" | "estimatedReturns") =>
    (value: number) => {
      setCalculatorState((prev) => {
        return { ...prev, [stateKey]: value };
      });
    };

  const investmentDurationInMonths = calculatorState.timeInYears * 12;
  const rateOfReturn = calculatorState.estimatedReturns;
  const monthlyRate = rateOfReturn / 12 / 100;
  const sipInvestmentAmount = calculatorState.sip * investmentDurationInMonths;
  const lumpsumInvestmentAmount = calculatorState.lumpsum;
  const totalInvestedAmount = lumpsumInvestmentAmount + sipInvestmentAmount;

  const sipFinalAmt =
    (calculatorState.sip *
      (Math.pow(1 + monthlyRate, investmentDurationInMonths) - 1)) /
    monthlyRate;

  const principalAmount = lumpsumInvestmentAmount;
  const annualInterestRate = rateOfReturn / 100; // Convert percentage to decimal
  const numberOfCompoundsPerYear = 1; // Assuming interest is compounded annually

  const lumpsumProfit =
    principalAmount *
      Math.pow(
        1 + annualInterestRate / numberOfCompoundsPerYear,
        calculatorState.timeInYears * numberOfCompoundsPerYear
      ) -
    principalAmount;

  const totalEstimatedReturns =
    sipFinalAmt - sipInvestmentAmount + lumpsumProfit;
  // const totalLumpsumValue = lumpsumInvestmentAmount + lumpsumProfit;
  // const totalSipValue = sipInvestmentAmount + sipProfit;
  const totalValue = totalInvestedAmount + totalEstimatedReturns;

  const totalInvestedPercentage = (totalInvestedAmount / totalValue) * 100;
  const lumpsumProfitPercentage = (lumpsumProfit / totalValue) * 100;
  // const lumpsumInvestmentPercentage =
  //   ((lumpsumInvestmentAmount * 100) / totalValue)*100;
  const sipProfitPercentage = (sipFinalAmt / totalValue) * 100;
  // const sipInvestmentPercentage = ((sipInvestmentAmount * 100) / totalValue)*100;

  const { width } = useWindowSize();

  return (
    <Container fluid px={0} py="md">
      <Grid>
        <Grid.Col md={6} sm={12}>
          <CalculatorSectionInputGroup
            label="Lumpsum ₹"
            value={calculatorState.lumpsum}
            setValue={changeHandler("lumpsum")}
            max={100000000}
            min={0}
            step={1000}
          />
          <CalculatorSectionInputGroup
            label="SIP ₹"
            value={calculatorState.sip}
            setValue={changeHandler("sip")}
            max={1000000}
            min={0}
            step={100}
          />
          <CalculatorSectionInputGroup
            label="Expected rate of return (p.a) %"
            value={calculatorState.estimatedReturns}
            setValue={changeHandler("estimatedReturns")}
            max={100}
            min={0}
            step={0.1}
          />
          <CalculatorSectionInputGroup
            label="Time period in years"
            value={calculatorState.timeInYears}
            setValue={changeHandler("timeInYears")}
            max={100}
            min={0}
            step={1}
          />

          <Space my="md" />

          <CalculatorSectionDataDisplayGroup
            label="Invested amount"
            data={totalInvestedAmount.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: "currency",
              currency: "INR",
            })}
          />
          <CalculatorSectionDataDisplayGroup
            label="Lumpsum Est. returns"
            data={lumpsumProfit.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: "currency",
              currency: "INR",
            })}
          />
          <CalculatorSectionDataDisplayGroup
            label="SIP Est. returns"
            data={(sipFinalAmt || 0).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: "currency",
              currency: "INR",
            })}
          />
          <CalculatorSectionDataDisplayGroup
            label="Total Est. returns"
            data={(totalEstimatedReturns || 0).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: "currency",
              currency: "INR",
            })}
          />
          <CalculatorSectionDataDisplayGroup
            label="Total value"
            data={(totalValue || 0).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: "currency",
              currency: "INR",
            })}
          />
        </Grid.Col>
        <Grid.Col
          md={6}
          sm={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div>
            <Text>
              <Badge
                variant="filled"
                color="indigo"
                h={8}
                px={6}
                mr={4}
                style={{ position: "relative", bottom: "4px" }}
              />
              Invested Amount
            </Text>
            <Text>
              <Badge
                variant="filled"
                color="cyan"
                h={8}
                px={6}
                mr={4}
                style={{ position: "relative", bottom: "4px" }}
              />
              Lumpsum returns
            </Text>
            <Text>
              <Badge
                variant="filled"
                color="green"
                h={8}
                px={6}
                mr={4}
                style={{ position: "relative", bottom: "4px" }}
              />
              SIP returns
            </Text>
            <RingProgress
              size={width < 952 ? width / 2 : 400}
              thickness={width > 756 ? 40 : 20}
              sections={
                totalInvestedAmount > 0
                  ? [
                      {
                        value: totalInvestedPercentage,
                        color: "indigo",
                        tooltip: "Invested amount",
                      },
                      {
                        value: lumpsumProfitPercentage,
                        color: "cyan",
                        tooltip: "Lumpsum returns",
                      },
                      {
                        value: sipProfitPercentage,
                        color: "green",
                        tooltip: "SIP returns",
                      },
                    ]
                  : []
              }
            />
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
