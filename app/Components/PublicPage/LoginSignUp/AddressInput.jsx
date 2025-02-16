import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import axios from "axios";

const API_KEY = "ak_m6kgz2ix8p1AE5DW6pLG78Hf9LE6L"; // Replace with your actual API key


/**
 * AddressSelect Component
 *
 * This component renders a searchable Autocomplete field for Address Line 1.
 * When a suggestion is selected, it fetches the full address details and
 * propagates additional fields (address2, address3, city, and postcode) via onChange.
 *
 * Props:
 * - value: The current value for Address Line 1.
 * - onChange: Callback that receives an event with target containing:
 *     - name: "address1"
 *     - value: the Address Line 1 string (searchable value)
 *     - address2, address3, city, postcode: the additional address fields.
 * - error: Boolean flag for error state.
 * - helperText: Helper text to display.
 * - disabled: Disables the input when true.
 */
const AddressSelect = ({
  value,
  onChange,
  error,
  helperText,
  disabled,
}) => {
  const [addressOptions, setAddressOptions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingFullAddress, setLoadingFullAddress] = useState(false);
  // inputValue holds the searchable address (Address Line 1)
  const [inputValue, setInputValue] = useState(value || "");
  // Ref used for debouncing API calls.
  const debounceRef = useRef(null);

  /**
   * Fetch autocomplete suggestions for the address.
   */
  const fetchAddressSuggestions = async (query) => {
    if (!query.trim()) {
      setAddressOptions([]);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const res = await axios.get(
        "https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses",
        {
          params: { api_key: API_KEY, query },
        }
      );
      // Expected suggestions are in res.data.result.hits or an empty array.
      setAddressOptions(res.data?.result?.hits || []);
    } catch (err) {
      console.error("Error fetching address suggestions:", err);
      setAddressOptions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  /**
   * Fetch the full address details using the UDPRN.
   */
  const fetchFullAddress = async (udprn) => {
    setLoadingFullAddress(true);
    try {
      const res = await axios.get(
        `https://api.ideal-postcodes.co.uk/v1/udprn/${udprn}`,
        {
          params: { api_key: API_KEY },
        }
      );
      return res.data?.result || null;
    } catch (err) {
      console.error("Error fetching full address:", err);
      return null;
    } finally {
      setLoadingFullAddress(false);
    }
  };

  /**
   * Debounce the input changes to reduce API calls.
   */
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchAddressSuggestions(inputValue);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue]);

  /**
   * When the text input changes, update the state and propagate the raw input value.
   * Note: The field name is now "address1" (the searchable address).
   */
  const handleInputChange = (event, newInputValue, reason) => {
    if (reason === "input") {
      setInputValue(newInputValue);
      // Propagate the raw input change using name "address1"
      onChange({
        target: {
          name: "address1",
          value: newInputValue,
        },
      });
    }
  };

  /**
   * When a suggestion is selected, fetch the full address details and propagate all required address fields.
   */
  const handleChange = async (event, selectedOption) => {
    if (selectedOption && selectedOption.udprn) {
      const fullAddress = await fetchFullAddress(selectedOption.udprn);
      if (fullAddress) {
        // Map the API response to the desired fields.
        const addressFields = {
          address1: fullAddress.line_1 || "",
          address2: fullAddress.line_2 || "",
          address3: fullAddress.line_3 || "",
          city: fullAddress.post_town || "",
          postcode: fullAddress.postcode || "",
        };

        // Propagate the fields using onChange with field name "address1".
        onChange({
          target: {
            name: "address1",
            value: addressFields.address1, // searchable value
            ...addressFields, // additional address fields
            fullAddress, // optionally, pass the full address object as well
          },
        });
        setInputValue(addressFields.address1);
      } else {
        // Fallback: use the suggestion text if the full address lookup fails.
        onChange({
          target: {
            name: "address1",
            value: selectedOption.suggestion,
          },
        });
        setInputValue(selectedOption.suggestion);
      }
      // Clear suggestions after selection.
      setAddressOptions([]);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={addressOptions}
      // Display the suggestion text.
      getOptionLabel={(option) => option.suggestion || ""}
      loading={loadingSuggestions}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      disabled={disabled || loadingFullAddress}
      noOptionsText="Begin typing to search for your address..."
      renderInput={(params) => (
        <TextField
          {...params}
          label="Address Line 1"
          error={!!error}
          helperText={helperText}
          placeholder="Start typing to get address suggestions..."
          required
          autoComplete="off"
          InputProps={{
            ...params.InputProps,
            autoComplete: "off", // Add this to ensure it works in all browsers
            endAdornment: (
              <>
                {(loadingSuggestions || loadingFullAddress) && (
                  <CircularProgress color="inherit" size={20} />
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AddressSelect;
