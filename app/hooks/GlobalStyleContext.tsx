import React, { createContext, useContext } from 'react';

// Define types for the colors, font styles, and font sizes
interface Colors {
    primary: string;
    secondary: string;
    bgColor: string;
}

interface FontStyle {
    titleFont: string;
    textFont: string;
}

interface FontSize {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
}

// Define the main GlobalStyles interface that includes all the above properties
export interface GlobalStyles {
    colors: Colors;
    fontStyle: FontStyle;
    fontSize: FontSize;
}


// Define the global style values
const defaultGlobalStyles: GlobalStyles = {

    colors: {
        primary: '#F50707',
        secondary: "#ffffff",
        bgColor: "#1A1616",
    },

    fontStyle: {
        titleFont: "TitleFont",
        textFont: "TextFont",
    },

    fontSize: {
        xs: 16,
        s: 20,
        m: 24,
        l: 30,
        xl: 48
    }
};

// Create the context with the GlobalStyles type
const GlobalStyleContext = createContext<GlobalStyles>(defaultGlobalStyles);

// Create the provider component
export const GlobalStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <GlobalStyleContext.Provider value={defaultGlobalStyles}>
            {children}
        </GlobalStyleContext.Provider>
    );
};

// Custom hook to access the GlobalStyleContext
const useGlobalStyle = () => useContext(GlobalStyleContext);

export default useGlobalStyle