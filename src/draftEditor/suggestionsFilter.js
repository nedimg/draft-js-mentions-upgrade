
function suggestionsFilter(searchValue, suggestions) {
    const value = searchValue.toLowerCase();
    return suggestions.filter(suggestion => !value || suggestion.name.toLowerCase().indexOf(value) > -1);
    // return filteredSuggestions.map(suggestion => ({ id: suggestion.id }));
}

export default suggestionsFilter;
