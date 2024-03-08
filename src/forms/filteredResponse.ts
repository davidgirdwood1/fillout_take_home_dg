import process from "node:process";
import { URLSearchParams } from "node:url"
import { FilterClauseType } from "../types";
import { FilterConditionsEnum } from "../enums"

// Helper function to make sure that the FilterClauseType passed in URL is valid
export const checkHasQueryErrors = (filters: FilterClauseType[]) => {
    if (!filters || filters.length == 0) {
        return false;
    }
    // Loop through the array of filters and make sure they are all valid
    const validConditions: string[] = Object.values(FilterConditionsEnum);
    for (const filter of filters) {
        // Make sure the condition matches filter in our enum
        const conditionInEnum = validConditions.includes(filter.condition);
        if (!conditionInEnum) { 
            throw(`Condition **${filter.condition}** not in ${validConditions}`);
        }
    }
    return false;
}

const getRequestHeaders = (): RequestInit => {
    const requestOptions: RequestInit = {
        headers: {
            'Authorization': `Bearer ${process.env.FILLOUT_API_KEY}`
        }
    };
    return requestOptions;
}

// Main function to apply the filters on responses
const filterResponsesUsingFilters = (responsesData: any, filters: FilterClauseType[]): any => {
    if (!filters || filters.length === 0 && Array.isArray(filters)) {
        console.error('No filters set in array');
        return responsesData;
    }

    const responses: [] = responsesData.responses;
    console.log("Num responses before filtering:", responses.length);

    // Filter out responses based on the filters
    const filteredResponses = responsesData.responses.filter((submission: { questions: any[]; }) => {
        // Every filter must resolve for true for the submission to be filtered
        return filters.every((filter) => {
            // find the first question with a matching ID. It's assumed that the same question won't be asked twice
            const question = submission.questions.find((question: { id: string; }) => question.id === filter.id)
            if (!question) {
                return false;
            }
            console.log(`Found a matching question for filter & question ID ${question.id}`)
            if (filter.condition === FilterConditionsEnum.Equals) {
                return filter.value === question.value
            }
            if (filter.condition === FilterConditionsEnum.DoesNotEqual) {
                return filter.value !== question.value
            }
            if (filter.condition === FilterConditionsEnum.GreaterThan) {
                return new Date(question.value) > new Date(filter.value)
            }
            if (filter.condition === FilterConditionsEnum.LessThan) {
                return new Date(question.value) < new Date(filter.value)
            }
        })
    });
    console.log("Num responses after filtering:", filteredResponses.length);
    return filteredResponses;
}

// Endpoint to call into FilloutApi and mirror the response back with filtering
export const fetchFilteredResponse = async (req: any, res: any) => {
    const apiKey = process.env.FILLOUT_API_KEY;
    if (!apiKey) {
        res.status(500).json({ message: 'Cannot Find Fillout API key' });
        return;
    }
    try {
        let filters: FilterClauseType[] = []; 
        if (req.query.filters !== undefined) { 
            filters  = JSON.parse(req.query.filters);
        }
        const filterErrors = checkHasQueryErrors(filters);
        if (filterErrors) { 
            res.status(500).json({ message: 'Invalid filters in query' });
            return;
        } 
        const { formId } = req.params;
        const { ...params } = req.query;
        // get all params in case we have a custom limit set
        const passThroughParams = new URLSearchParams(params).toString();

        // Fetch all submissions for the a given formID
        const apiUrl = `https://api.fillout.com/v1/api/forms/${formId}/submissions?${passThroughParams}`;
        const requestHeaders = getRequestHeaders();
        const response = await fetch(apiUrl, requestHeaders);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        const filteredSubmissions = filterResponsesUsingFilters(data, filters);
        let responseLimit = params["limit"] && params["limit"] > 0 ? params["limit"] : 150;
        res.json({
            responses: filteredSubmissions,
            totalResponses: filteredSubmissions.length,
            pageCount : Math.ceil(filteredSubmissions.length/responseLimit)
        })
    } catch (error) {
        console.log('Error Fetching from Fillout:', error);
        res.status(500).json({ message: 'Error Fetching Response', error });
    }
};