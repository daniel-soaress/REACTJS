import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { api } from "../services/api";

interface Transaction {
    id: number,
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

export const TransactionContext = createContext<TransactionContextData>(
    {} as TransactionContextData
);

export function TransactionsProvider(props: TransactionsProviderProps) {
    const [transactions, setTransaction] = useState<Transaction[]>([]);

    useEffect(() => {
        api.get('/transactions')
        .then(response => setTransaction(response.data.transactions))
    }, []);

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post('/transactions', transactionInput);
        const { transaction } = response.data;
        setTransaction([
            ...transactions,
            transaction,
        ]);
    }

    return(
        <TransactionContext.Provider
            value={{transactions, createTransaction}}>
            {props.children}
        </TransactionContext.Provider>
    )
}


export function useTransactions() {
    const context = useContext(TransactionContext);
    return context;
}

