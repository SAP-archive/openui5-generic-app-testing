Feature: Can trigger all actions provided by Gherkin Generic Steps

  Background: Initial state
    Given  I start the app from 'ui5app/test/ui5app.html'

  Scenario: iClickOnNestedItem by position
    Given I can see verticalBox in Main view
     When I click on the 3rd sap.ui.core.Item control deeply nested inside verticalBox in Main view
     Then I can see lblListItemClicked with text 'Circle shape was clicked' in Main view

  Scenario: iClickOnNestedItem by text
    Given I can see verticalBox in Main view
     When I click on the control deeply nested inside verticalBox with text containing 'quar' in Main view
     Then I can see lblListItemClicked with text 'Square shape was clicked' in Main view

  Scenario: iCanSee
    Then I can see btnClickMe in Main view
     And I can see btnClickMe with text containing 'button was clicked' in Main view
     And I can see btnClickMe with text starting with 'This button' in Main view
     And I can see btnClickMe with text ending with 'times' in Main view

   Scenario: iCanSee with bool property
     Then I can see btnClickMe in Main view
      And I can see btnClickMe with enabled being 'true' in Main view

  Scenario: iCanSee (nested)
    Then I can see the first sap.ui.core.Item control deeply nested inside verticalBox in Main view
     And I can see the control directly nested inside verticalBox with text 'Hide list of shapes' in Main view
     And I can see the first control directly nested inside verticalBox with text starting with 'Location:' in Main view

  Scenario: iClickOn
    Given I can see btnClickMe with text 'This button was clicked 0 times' in Main view
     When I click on btnClickMe in Main view
     Then I can see lblNumberClicked in Main view
      And I can see btnClickMe with text 'This button was clicked 1 times' in Main view

  Scenario: iClickOnAggregationItem first item
    Given I can see lstShapes in Main view
     When I click on first item of lstShapes items in Main view
     Then I can see lblListItemClicked with text 'Triangle shape was clicked' in Main view
  Scenario: iClickOnAggregationItem 2nd item
    Given I can see lstShapes in Main view
     When I click on 2nd item of lstShapes items in Main view
     Then I can see lblListItemClicked with text 'Square shape was clicked' in Main view
  Scenario: iClickOnAggregationItem last item
    Given I can see lstShapes in Main view
     When I click on last item of lstShapes items in Main view
     Then I can see lblListItemClicked with text 'Circle shape was clicked' in Main view

  Scenario: iEnterText
    Given I can see txtProductId in Main view
     When I enter '00012345689ABC' into txtProductId in Main view
     Then I can see txtProductId with value '00012345689ABC' in Main view

  Scenario: aggregationHasItem count existing items
    Given I can see lstShapes in Main view
     Then lstShapes in Main view contains 3 items
  Scenario: aggregationHasItem contains existing items
    Given I can see lstShapes in Main view
     Then lstShapes in Main view contains items
  Scenario: aggregationHasItem count after removing items
    Given I can see lstShapes in Main view
     When I click on btnRemoveListItem in Main view 3 times
     Then lstShapes in Main view contains no items

  Scenario: iPressBrowserBack pre-requisite
    Given I can see lblLocation in Main view
      And I can see btnNavigate in Main view
     When I click on btnNavigate in Main view
      And I click on btnRefreshLocation in Main view
     Then I can see lblLocation with text ending with 'ui5app.html#nav' in Main view

  Scenario: iPressBrowserBack pre-requisite
    Given I can see lblLocation in Main view
     When I click on btnNavigate in Main view
      And I press browser back
     Then I can see lblLocation with text containing 'ui5app.html' in Main view

  Scenario: iCannotSee (item does not exist - no main view given)
     Then I cannot see btnNotExisting
  Scenario: iCannotSee (item is invisible - main view specified)
    Given I can see lstShapes in Main view
      And I click on btnHide in Main view
     Then I cannot see lstShapes in Main view
  Scenario: iCannotSee (item does not exist)
     Then I cannot see notExistingButton in Main view
