import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function SQLTable({ responseData }: { responseData: any }) {
    const [tableData, setTableData] = useState([]);
    const [tableHeads, setTableHeads] = useState<string[]>([]);

    useEffect(() => {
        const fitData = async () => {
            try {
                if (responseData && responseData.result && responseData.result.length > 0) {
                    setTableHeads(Object.keys(responseData.result[0]));
                    setTableData(responseData.result);
                }
            } catch (error) {
                console.error('There was a problem fetching the data:', error);
            }
        };

        fitData();
    }, [responseData]);

   
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {tableHeads.map((head, index) => (
                        <TableHead key={index} className="w-[100px]">{head}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData.map((dataLine, index) => (
                    <TableRow key={index}>
                        {Object.values(dataLine).map((data, index) => (
                            <TableCell key={index}>{data as string}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
