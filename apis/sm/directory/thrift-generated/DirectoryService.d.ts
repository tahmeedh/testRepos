//
// Autogenerated by Thrift Compiler (0.16.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//

import thrift = require('thrift');
import Thrift = thrift.Thrift;
import Q = thrift.Q;
import Int64 = require('node-int64');

import ttypes = require('./Directory_types');
import AttributeVisibility = ttypes.AttributeVisibility
import AttributeEditability = ttypes.AttributeEditability
import SearchScope = ttypes.SearchScope
import X_GR_API_VERSION_VALUE = ttypes.X_GR_API_VERSION_VALUE
import FailureException = ttypes.FailureException
import UserProfileEditabilityException = ttypes.UserProfileEditabilityException
import InvalidSearchCriteriaException = ttypes.InvalidSearchCriteriaException
import UserNotFoundException = ttypes.UserNotFoundException
import UserNotEntitledException = ttypes.UserNotEntitledException
import OperationNotFoundException = ttypes.OperationNotFoundException
import PagingStruct = ttypes.PagingStruct
import ReportsToStruct = ttypes.ReportsToStruct
import UserProfileAttributeSettingStruct = ttypes.UserProfileAttributeSettingStruct
import UserProfileAttributeValueStruct = ttypes.UserProfileAttributeValueStruct
import UserProfileUserSetAttributesStruct = ttypes.UserProfileUserSetAttributesStruct
import CompanyProfileStruct = ttypes.CompanyProfileStruct
import UserProfileStruct = ttypes.UserProfileStruct
import DirectorySettingsStruct = ttypes.DirectorySettingsStruct
import UserAutoCompleteResultStruct = ttypes.UserAutoCompleteResultStruct
import DirectoryBasicSearchParametersStruct = ttypes.DirectoryBasicSearchParametersStruct
import DirectoryAdvancedSearchParametersStruct = ttypes.DirectoryAdvancedSearchParametersStruct
import DirectorySearchMatchStruct = ttypes.DirectorySearchMatchStruct
import PeopleSearchResultStruct = ttypes.PeopleSearchResultStruct
import CompanySearchResultStruct = ttypes.CompanySearchResultStruct
import PeopleSearchResultsStruct = ttypes.PeopleSearchResultsStruct
import CompanySearchResultsStruct = ttypes.CompanySearchResultsStruct
import PeopleSearchFilterStruct = ttypes.PeopleSearchFilterStruct
import PeopleSearchParametersStruct = ttypes.PeopleSearchParametersStruct
import CompanySearchFilterStruct = ttypes.CompanySearchFilterStruct
import CompanySearchParametersStruct = ttypes.CompanySearchParametersStruct

/**
 * SERVICE
 */
declare class Client {
  private output: thrift.TTransport;
  private pClass: thrift.TProtocol;
  private _seqid: number;

  constructor(output: thrift.TTransport, pClass: { new(trans: thrift.TTransport): thrift.TProtocol });

  /**
   * Gets the company profile of the given company.
   * 
   * @param companyId
   *  Service Manager ID of the company.
   */
  getCompanyProfile(companyId: number): CompanyProfileStruct;

  /**
   * Gets the company profile of the given company.
   * 
   * @param companyId
   *  Service Manager ID of the company.
   */
  getCompanyProfile(companyId: number, callback?: (error: ttypes.FailureException, response: CompanyProfileStruct)=>void): void;

  /**
   * Gets the user profile for the given user.
   * 
   * @param userId
   *  Service Manager ID of the user for whom to retrieve the profile.
   * @param actingUserId
   *  Service Manager ID of the user who is acting. Used to determine which information to return based on visibility settings.
   */
  getUserProfile(userId: Int64, actingUserId: Int64): UserProfileStruct;

  /**
   * Gets the user profile for the given user.
   * 
   * @param userId
   *  Service Manager ID of the user for whom to retrieve the profile.
   * @param actingUserId
   *  Service Manager ID of the user who is acting. Used to determine which information to return based on visibility settings.
   */
  getUserProfile(userId: Int64, actingUserId: Int64, callback?: (error: ttypes.FailureException, response: UserProfileStruct)=>void): void;

  /**
   * Updates the user profile of the user.
   * 
   * @param userId
   *  Service Manager ID of the user.
   * @param userSetAttributes
   *  User-set attributes that will be updated (if company settings allow for it).
   */
  updateUserProfile(userId: Int64, userSetAttributes: UserProfileUserSetAttributesStruct): void;

  /**
   * Updates the user profile of the user.
   * 
   * @param userId
   *  Service Manager ID of the user.
   * @param userSetAttributes
   *  User-set attributes that will be updated (if company settings allow for it).
   */
  updateUserProfile(userId: Int64, userSetAttributes: UserProfileUserSetAttributesStruct, callback?: (error: ttypes.FailureException | ttypes.UserProfileEditabilityException | ttypes.UserNotFoundException, response: void)=>void): void;

  /**
   * Returns list of users who has the specified user ID as their "Reports To" user.
   * 
   * @param userId
   *  Service Manager ID of the user.
   * @return
   *  Full list of users that has specified user as the "reports to" user.
   */
  getReportsToUsers(userId: Int64): PeopleSearchResultsStruct;

  /**
   * Returns list of users who has the specified user ID as their "Reports To" user.
   * 
   * @param userId
   *  Service Manager ID of the user.
   * @return
   *  Full list of users that has specified user as the "reports to" user.
   */
  getReportsToUsers(userId: Int64, callback?: (error: ttypes.FailureException | ttypes.UserNotFoundException, response: PeopleSearchResultsStruct)=>void): void;

  /**
   *    * Updates the company profile with the supplied data.
   *    *
   * * USED FOR TESTING PURPOSES ONLY.
   * *
   *    * @param companyProfile
   *    *  Company profile that will be updated.
   */
  updateCompanyProfile(companyProfile: CompanyProfileStruct): void;

  /**
   *    * Updates the company profile with the supplied data.
   *    *
   * * USED FOR TESTING PURPOSES ONLY.
   * *
   *    * @param companyProfile
   *    *  Company profile that will be updated.
   */
  updateCompanyProfile(companyProfile: CompanyProfileStruct, callback?: (error: ttypes.FailureException, response: void)=>void): void;

  /**
   *    * Updates the directory settings.
   *    *
   * *
   *    * @param directorySettings
   *    *  Directory settings that will be updated.
   */
  updateDirectorySettings(directorySettings: DirectorySettingsStruct): void;

  /**
   *    * Updates the directory settings.
   *    *
   * *
   *    * @param directorySettings
   *    *  Directory settings that will be updated.
   */
  updateDirectorySettings(directorySettings: DirectorySettingsStruct, callback?: (error: ttypes.FailureException, response: void)=>void): void;

  /**
   *    * Assigns the users a new Directory role with the given operations (entitlements). If a role with the same name
   * * already exists, its existing operations are cleared and replaced with the new list of operations.
   *    *
   * * USED FOR TESTING PURPOSES ONLY.
   * *
   *    * @param userIds
   *    *  The users to be assigned the role with the operations.
   * *
   * * @param operations
   *    *  A list of the operations the role will have. All operations MUST exist in the seeded set of Service Manager operations.
   * *
   * * @param roleName
   *    *  The name of the role.
   */
  setUserDirectoryOperations(userIds: Int64[], operations: string[], roleName: string): void;

  /**
   *    * Assigns the users a new Directory role with the given operations (entitlements). If a role with the same name
   * * already exists, its existing operations are cleared and replaced with the new list of operations.
   *    *
   * * USED FOR TESTING PURPOSES ONLY.
   * *
   *    * @param userIds
   *    *  The users to be assigned the role with the operations.
   * *
   * * @param operations
   *    *  A list of the operations the role will have. All operations MUST exist in the seeded set of Service Manager operations.
   * *
   * * @param roleName
   *    *  The name of the role.
   */
  setUserDirectoryOperations(userIds: Int64[], operations: string[], roleName: string, callback?: (error: ttypes.FailureException | ttypes.UserNotFoundException | ttypes.OperationNotFoundException, response: void)=>void): void;

  /**
   * Performs a basic/filtered search on companies in the Directory. The search scope includes all the company profile attributes regardless of company visibility settings.
   *  
   *  Keywords (basic search):
   * 
   *  Matching will be done by looking at attributes values that start with the keyword. Language specific word break characters are used to break the text into multiple
   *  words to search on. A Search for "Glo" will match "Global", "Gloom" and "john@global.net" since the "at sign - @" is a word break character. It will not
   *  find "ABCGlobal".
   * 
   *  Company Filters (standard search):
   * 
   *  Performs an standard search on companies for a predefined set of filters (see StandardCompanySearchParametersStruct). Each filter is an AND condition.
   *  Example: if company name is "Global" and city is "Vancouver", it will return Global from Vancouver, but not Global from New York.
   * 
   *  Matching will be done by looking at attributes values that start with the keyword. Language specific word break characters are used to break the text into multiple
   *  words to search on. A Search for "Glo" will match "Global", "Gloom" and "john@global.net" since the "at sign - @" is a word break character. It will not
   *  find "ABCGlobal".
   * 
   *  NOTE: Paging functionality was deferred and therefore the PagingStruct will be ignored until further notice. For now it will return the first 200 results.
   *  
   *  @param parameters
   *   Criteria for performing a company search:
   *   - Basic search: At least one keyword of 2 character and longer is required. Each keyword is an OR condition; passing in the keyword list "Global Relay"
   *     will match both "global Attractions" and "Speed Relay".
   *   - Standard search: At least one filter value needs to be provided. Each filter is an AND condition; passing in the filter of City: "Vancouver" will only
   *     match results where the companies city is "Vancouver".
   *   - Combined search: At least one keyword and one filter needs to be provided. Passing in the keyword "Smith" and city filter: "Vancouver" will find all
   *     people with "smith" in any of their profile attributes as well as where its city is equal to "Vancouver".
   * 
   *   A company ID may be optionally specified; if it is not, the search is in whole directory.
   *   NOTE: Since there is no way of scoping a company by another company (without in depth LEI info) the CompanyID property is ignored at the moment.
   * 
   *  @return
   *   List of companies search results, returning specified amount as per "PagingStruct". Only a predefined set of attributes (see CompanySearchResultsStruct) will
   *   be returned, even if the matching attribute is not contained in the result struct.
   */
  performCompanySearch(parameters: CompanySearchParametersStruct): CompanySearchResultsStruct;

  /**
   * Performs a basic/filtered search on companies in the Directory. The search scope includes all the company profile attributes regardless of company visibility settings.
   *  
   *  Keywords (basic search):
   * 
   *  Matching will be done by looking at attributes values that start with the keyword. Language specific word break characters are used to break the text into multiple
   *  words to search on. A Search for "Glo" will match "Global", "Gloom" and "john@global.net" since the "at sign - @" is a word break character. It will not
   *  find "ABCGlobal".
   * 
   *  Company Filters (standard search):
   * 
   *  Performs an standard search on companies for a predefined set of filters (see StandardCompanySearchParametersStruct). Each filter is an AND condition.
   *  Example: if company name is "Global" and city is "Vancouver", it will return Global from Vancouver, but not Global from New York.
   * 
   *  Matching will be done by looking at attributes values that start with the keyword. Language specific word break characters are used to break the text into multiple
   *  words to search on. A Search for "Glo" will match "Global", "Gloom" and "john@global.net" since the "at sign - @" is a word break character. It will not
   *  find "ABCGlobal".
   * 
   *  NOTE: Paging functionality was deferred and therefore the PagingStruct will be ignored until further notice. For now it will return the first 200 results.
   *  
   *  @param parameters
   *   Criteria for performing a company search:
   *   - Basic search: At least one keyword of 2 character and longer is required. Each keyword is an OR condition; passing in the keyword list "Global Relay"
   *     will match both "global Attractions" and "Speed Relay".
   *   - Standard search: At least one filter value needs to be provided. Each filter is an AND condition; passing in the filter of City: "Vancouver" will only
   *     match results where the companies city is "Vancouver".
   *   - Combined search: At least one keyword and one filter needs to be provided. Passing in the keyword "Smith" and city filter: "Vancouver" will find all
   *     people with "smith" in any of their profile attributes as well as where its city is equal to "Vancouver".
   * 
   *   A company ID may be optionally specified; if it is not, the search is in whole directory.
   *   NOTE: Since there is no way of scoping a company by another company (without in depth LEI info) the CompanyID property is ignored at the moment.
   * 
   *  @return
   *   List of companies search results, returning specified amount as per "PagingStruct". Only a predefined set of attributes (see CompanySearchResultsStruct) will
   *   be returned, even if the matching attribute is not contained in the result struct.
   */
  performCompanySearch(parameters: CompanySearchParametersStruct, callback?: (error: ttypes.FailureException | ttypes.InvalidSearchCriteriaException | ttypes.UserNotFoundException | ttypes.UserNotEntitledException, response: CompanySearchResultsStruct)=>void): void;

  /**
   * Performs a basic/filtered scoped search on people in the Directory.
   * 
   * UserId: SM User Id of the user who performs the search.
   * 
   * SearchScope: Search results will be filtered depending on the provided scope.
   *    SearchScope.ALL: Return every user that matches the search
   *    SearchScope.PUBLIC: Return every user that matches the search and has a public directory entitlement
   *    SearchScope.COMPANY: Return every user that matches the search, is part of the same company and has a company directory entitlement
   * 
   * NOTE: Company ID in the parameter struct is not used. The company ID used to filter the search is retrieved using the User info that is passed in.
   * 
   * Keywords (basic search):
   * 
   * Matching will be done by looking at attributes values that start with the keyword. Language specific word break characters are used to break the text into multiple
   * words to search on. A Search for "Mich" will find "Michael", "Michelle" and "reid.michael@company.net" (since the dot "." is a word break character). It will not
   * find "ABCMichelle".
   * 
   * People Filters (standard search):
   * 
   * Performs an standard search on people for a predefined set of filters (see StandardPeopleSearchParametersStruct). Each filter is an AND condition.
   * Example: if lastName is "Reid" and city is "Vancouver", it will return Michael Reid from Vancouver, but not Jim Reid from Toronto.
   * 
   * Matching will be done by looking at attributes values that start with the keyword. Language specific word break characters are used to break the text into multiple
   * words to search on. A Search for "Mich" will find "Michael", "Michelle" and "reid.michael@company.net" (since the dot "." is a word break character). It will not
   * find "ABCMichelle".
   * 
   * NOTE: Paging functionality was deferred and therefore the PagingStruct will be ignored until further notice. For now it will return the first 200 results.
   * 
   * @param parameters
   *  Criteria for performing a people search:
   *  - Basic search: At least one keyword of 2 character and longer is required. Each keyword is an OR condition; passing in the keyword list "Michael Reid"
   *    will match both "Michael Jones" and "Jim Reid".
   *  - Standard search: At least one filter value needs to be provided. Each filter is an AND condition; passing in the filter of City: "Vancouver" will only
   *    match results where the people's city is "Vancouver".
   *  - Combined search: At least one keyword and one filter needs to be provided. Passing in the keyword "Smith" and city filter: "Vancouver" will find all
   *    people with "smith" in any of their profile attributes as well as its where its city is equal to "Vancouver".
   * 
   * @return
   *  List of people search results, returning specified amount as per "PagingStruct". Only a predefined set of attributes (see PeopleSearchResultsStruct) will
   *  be returned, even if the matching attribute is not contained in the result struct.
   */
  performPeopleSearchV2(parameters: PeopleSearchParametersStruct): PeopleSearchResultsStruct;

  /**
   * Performs a basic/filtered scoped search on people in the Directory.
   * 
   * UserId: SM User Id of the user who performs the search.
   * 
   * SearchScope: Search results will be filtered depending on the provided scope.
   *    SearchScope.ALL: Return every user that matches the search
   *    SearchScope.PUBLIC: Return every user that matches the search and has a public directory entitlement
   *    SearchScope.COMPANY: Return every user that matches the search, is part of the same company and has a company directory entitlement
   * 
   * NOTE: Company ID in the parameter struct is not used. The company ID used to filter the search is retrieved using the User info that is passed in.
   * 
   * Keywords (basic search):
   * 
   * Matching will be done by looking at attributes values that start with the keyword. Language specific word break characters are used to break the text into multiple
   * words to search on. A Search for "Mich" will find "Michael", "Michelle" and "reid.michael@company.net" (since the dot "." is a word break character). It will not
   * find "ABCMichelle".
   * 
   * People Filters (standard search):
   * 
   * Performs an standard search on people for a predefined set of filters (see StandardPeopleSearchParametersStruct). Each filter is an AND condition.
   * Example: if lastName is "Reid" and city is "Vancouver", it will return Michael Reid from Vancouver, but not Jim Reid from Toronto.
   * 
   * Matching will be done by looking at attributes values that start with the keyword. Language specific word break characters are used to break the text into multiple
   * words to search on. A Search for "Mich" will find "Michael", "Michelle" and "reid.michael@company.net" (since the dot "." is a word break character). It will not
   * find "ABCMichelle".
   * 
   * NOTE: Paging functionality was deferred and therefore the PagingStruct will be ignored until further notice. For now it will return the first 200 results.
   * 
   * @param parameters
   *  Criteria for performing a people search:
   *  - Basic search: At least one keyword of 2 character and longer is required. Each keyword is an OR condition; passing in the keyword list "Michael Reid"
   *    will match both "Michael Jones" and "Jim Reid".
   *  - Standard search: At least one filter value needs to be provided. Each filter is an AND condition; passing in the filter of City: "Vancouver" will only
   *    match results where the people's city is "Vancouver".
   *  - Combined search: At least one keyword and one filter needs to be provided. Passing in the keyword "Smith" and city filter: "Vancouver" will find all
   *    people with "smith" in any of their profile attributes as well as its where its city is equal to "Vancouver".
   * 
   * @return
   *  List of people search results, returning specified amount as per "PagingStruct". Only a predefined set of attributes (see PeopleSearchResultsStruct) will
   *  be returned, even if the matching attribute is not contained in the result struct.
   */
  performPeopleSearchV2(parameters: PeopleSearchParametersStruct, callback?: (error: ttypes.FailureException | ttypes.InvalidSearchCriteriaException | ttypes.UserNotFoundException | ttypes.UserNotEntitledException, response: PeopleSearchResultsStruct)=>void): void;

  /**
   *    * Waits full text indices to be built.
   *    *
   * * USED FOR TESTING PURPOSES ONLY.
   * *
   */
  waitForFullTextIndexing(): void;

  /**
   *    * Waits full text indices to be built.
   *    *
   * * USED FOR TESTING PURPOSES ONLY.
   * *
   */
  waitForFullTextIndexing(callback?: (error: ttypes.FailureException, response: void)=>void): void;
}

declare class Processor {
  private _handler: object;

  constructor(handler: object);
  process(input: thrift.TProtocol, output: thrift.TProtocol): void;
  process_getCompanyProfile(seqid: number, input: thrift.TProtocol, output: thrift.TProtocol): void;
  process_getUserProfile(seqid: number, input: thrift.TProtocol, output: thrift.TProtocol): void;
  process_updateUserProfile(seqid: number, input: thrift.TProtocol, output: thrift.TProtocol): void;
  process_getReportsToUsers(seqid: number, input: thrift.TProtocol, output: thrift.TProtocol): void;
  process_updateCompanyProfile(seqid: number, input: thrift.TProtocol, output: thrift.TProtocol): void;
  process_updateDirectorySettings(seqid: number, input: thrift.TProtocol, output: thrift.TProtocol): void;
  process_setUserDirectoryOperations(seqid: number, input: thrift.TProtocol, output: thrift.TProtocol): void;
  process_performCompanySearch(seqid: number, input: thrift.TProtocol, output: thrift.TProtocol): void;
  process_performPeopleSearchV2(seqid: number, input: thrift.TProtocol, output: thrift.TProtocol): void;
  process_waitForFullTextIndexing(seqid: number, input: thrift.TProtocol, output: thrift.TProtocol): void;
}
