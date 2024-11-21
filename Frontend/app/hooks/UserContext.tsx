import React, { createContext, useContext, useState } from 'react';


// Define the structure of the User object
export interface User {
    id: string;
    fname: string;
    lname: string;
    age: number;
    email: string;
    password: string
    isLoggedIn: boolean
}


// Define the structure of the context value
interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default useUser;