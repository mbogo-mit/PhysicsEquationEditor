let Templates = {
  "editorLogger":
  `
  <div class="row my-row">
    <div class="my-col col s12">
      <i id="close-editor-log" class="material-icons tiny" onclick="CloseEditorLog()">cancel</i>
      <ul class="collapsible log-container">
        <li class="success-log">
          <div class="collapsible-header">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="green-text text-lighten-2 bi bi-check-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <span>Success</span>
            <span class="badge" data-badge-caption="<%= log.success.length %>"></span>
          </div>
          <div class="collapsible-body information-container">
            <ul class="collapsible popout">
              <% for(let i = 0; i < log.success.length; i++){%>
              <li>
                <div class="collapsible-header"><%= log.success[i].error.type %><span class="badge">Line: <%= log.success[i].lineNumber %></span></div>
                <div class="collapsible-body"><span><%= log.success[i].error.description %></span></div>
              </li>
              <% } %>
            </ul>
          </div>
        </li>
        <li class="info-log">
          <div class="collapsible-header">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="blue-text text-lighten-2 bi bi-info-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
            <span>Info</span>
            <span class="badge" data-badge-caption="<%= log.info.length %>"></span>
          </div>
          <div class="collapsible-body information-container">
            <ul class="collapsible popout">
              <% for(let i = 0; i < log.info.length; i++){%>
              <li>
                <div class="collapsible-header"><%= log.info[i].error.type %><span class="badge">Line: <%= log.info[i].lineNumber %></span></div>
                <div class="collapsible-body"><span><%= log.info[i].error.description %></span></div>
              </li>
              <% } %>
            </ul>
          </div>
        </li>
        <li class="warning-log">
          <div class="collapsible-header">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="amber-text text-lighten-2 bi bi-exclamation-triangle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            <span>Warning</span>
            <span class="badge" data-badge-caption="<%= log.warning.length %>"></span>
          </div>
          <div class="collapsible-body information-container">
            <ul class="collapsible popout">
              <% for(let i = 0; i < log.warning.length; i++){%>
              <li>
                <div class="collapsible-header"><%= log.warning[i].warning %><span class="badge">Line: <%= log.warning[i].lineNumber %></span></div>
                <div class="collapsible-body">
                  <div class="row">
                    <div class="col m12">
                      <% for(let c =0; c < log.warning[i].variables.length; c++){%>
                          <span class="undefined-variable-badge log-static-latex" latex="<%= log.warning[i].variables[c] %>"><%= log.warning[i].variables[c] %></span>
                      <% }%>
                    </div>
                  </div>
                </div>
              </li>
              <% } %>
            </ul>
          </div>
        </li>
        <li class="error-log">
          <div class="collapsible-header">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="red-text text-lighten-2 bi bi-bug-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M4.978.855a.5.5 0 1 0-.956.29l.41 1.352A4.985 4.985 0 0 0 3 6h10a4.985 4.985 0 0 0-1.432-3.503l.41-1.352a.5.5 0 1 0-.956-.29l-.291.956A4.978 4.978 0 0 0 8 1a4.979 4.979 0 0 0-2.731.811l-.29-.956zM13 6v1H8.5v8.975A5 5 0 0 0 13 11h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 1 0 1 0v-.5a1.5 1.5 0 0 0-1.5-1.5H13V9h1.5a.5.5 0 0 0 0-1H13V7h.5A1.5 1.5 0 0 0 15 5.5V5a.5.5 0 0 0-1 0v.5a.5.5 0 0 1-.5.5H13zm-5.5 9.975V7H3V6h-.5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 0-1 0v.5A1.5 1.5 0 0 0 2.5 7H3v1H1.5a.5.5 0 0 0 0 1H3v1h-.5A1.5 1.5 0 0 0 1 11.5v.5a.5.5 0 1 0 1 0v-.5a.5.5 0 0 1 .5-.5H3a5 5 0 0 0 4.5 4.975z"/>
            </svg>
            <span>Error</span>
            <span class="badge" data-badge-caption="<%= log.error.length %>"></span>
          </div>
          <div class="collapsible-body information-container">
            <ul class="collapsible popout">
              <% for(let i = 0; i < log.error.length; i++){%>
              <li>
                <div class="collapsible-header"><%= log.error[i].error.type %><span class="badge">Line: <%= log.error[i].lineNumber %></span></div>
                <div class="collapsible-body"><span><%= log.error[i].error.description %></span></div>
              </li>
              <% } %>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
  `,
  "editor-line":
  `
  <div class="editor_line row">
    <div class="line_label col m1">
      <span class="active line-number">1</span>
      <span onclick="OpenEditorLog('warning')" class="line-warning" mf="<%= rid %>">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="amber-text text-lighten-2 bi bi-exclamation-triangle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
        </svg>
      </span>
      <span onclick="OpenEditorLog('error')" class="line-error" mf="<%= rid %>">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="red-text text-lighten-2 bi bi-bug-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4.978.855a.5.5 0 1 0-.956.29l.41 1.352A4.985 4.985 0 0 0 3 6h10a4.985 4.985 0 0 0-1.432-3.503l.41-1.352a.5.5 0 1 0-.956-.29l-.291.956A4.978 4.978 0 0 0 8 1a4.979 4.979 0 0 0-2.731.811l-.29-.956zM13 6v1H8.5v8.975A5 5 0 0 0 13 11h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 1 0 1 0v-.5a1.5 1.5 0 0 0-1.5-1.5H13V9h1.5a.5.5 0 0 0 0-1H13V7h.5A1.5 1.5 0 0 0 15 5.5V5a.5.5 0 0 0-1 0v.5a.5.5 0 0 1-.5.5H13zm-5.5 9.975V7H3V6h-.5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 0-1 0v.5A1.5 1.5 0 0 0 2.5 7H3v1H1.5a.5.5 0 0 0 0 1H3v1h-.5A1.5 1.5 0 0 0 1 11.5v.5a.5.5 0 1 0 1 0v-.5a.5.5 0 0 1 .5-.5H3a5 5 0 0 0 4.5 4.975z"/>
        </svg>
      </span>
      <span class="line-question" mf="<%= rid %>"><i class="fas fa-question-circle"></i></span>
    </div>
    <div class="col m11 my_math_field_col">
      <div id="<%= rid %>" class="my_math_field" onkeydown="KeyLogger()" onkeyup="KeyLogger()" onmousedown="FocusOnThisMathField('<%= rid %>')"></div>
    </div>
  </div>
  `,
  "VariableCollection": {
    "physics-constant":
    `
    <li class="collection-item">
      <span class="static-physics-equation" latex="<%= opts.ls %>" rid="<%= opts.variable.rid %>"></span>
      <span class="right delete-var" onclick="UpdateMyVariablesCollection({ls: '<%= opts.ls %>', rid: '<%= opts.variable.rid %>',remove: true, uncheckbox: true, editable: false})"><i class="material-icons">close</i></span>
      <span class="new badge physics-constant" data-badge-caption="<%= opts.variable.quantityDescription %>"></span>
      <span class="new badge constant-info" data-badge-caption=""><span latex="<%= opts.variable.unit %>" rid="<%= opts.variable.rid %>"></span></span>
      <span class="new badge constant-info" data-badge-caption=""><span latex="=<%= opts.variable.value %>" rid="<%= opts.variable.rid %>"></span></span>
    </li>
    `,
    "defined-variable":
    `
    <li class="collection-item">
      <span class="static-physics-equation editable-variable" latex="<%= opts.ls %>" rid="<%= opts.variable.rid %>"></span>
      <span class="right delete-var" onclick="UpdateMyVariablesCollection({rid: '<%= opts.variable.rid %>',remove: true, editable: true})"><i class="material-icons">close</i></span>
      <span onclick="ToggleVariableState('<%= opts.variable.rid %>')" class="new badge <%= opts.variable.state %>" data-badge-caption="<%= opts.variable.state %>"></span>
      <% if(opts.variable.dynamicUnits){%>
        <span onclick="DefineVariableUnits($(this), '<%= opts.variable.rid %>')" class="new badge info units dynamic-units tooltipped" data-position="bottom" data-tooltip="This unit was dynamically created by the editor" data-badge-caption="<%= opts.variable.units %>"></span>
      <%}else{%>
        <span onclick="DefineVariableUnits($(this), '<%= opts.variable.rid %>')" class="new badge info units tooltipped" data-position="bottom" data-tooltip="This unit was set by the user or imported" data-badge-caption="<%= opts.variable.units %>"></span>
      <%}%>
      <% if(opts.variable.type == "vector" && !opts.variable.canBeVector){%>
        <span class="new badge info cantBeVector btn-floating pulse tooltipped" data-position="left" data-tooltip="This unit can't be a vector" data-badge-caption="<%= opts.variable.type %>">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-bug" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6H4a3.99 3.99 0 0 1 1.333-2.982A3.983 3.983 0 0 1 8 2c1.025 0 1.959.385 2.666 1.018A3.989 3.989 0 0 1 12 6z"/>
          </svg>
        </span>
      <%}else{%>
      <span class="new badge info uneditable" data-badge-caption="<%= opts.variable.type %>"></span>
      <%}%>
    </li>
    `,
    "undefined-variable":
    `
    <li class="collection-item undefined-variable">
      <span class="static-physics-equation editable-variable" latex="<%= opts.ls %>" rid="<%= opts.variable.rid %>"></span>
      <span class="right delete-var" onclick="UpdateMyVariablesCollection({remove: true, cantRemove: true})"><i class="material-icons">close</i></span>
      <span onclick="ToggleVariableState('<%= opts.variable.rid %>')" class="new badge <%= opts.variable.state %>" data-badge-caption="<%= opts.variable.state %>"></span>
      <span onclick="DefineVariableUnits($(this), '<%= opts.variable.rid %>')" class="new badge info undefined-units units" data-badge-caption="<%= opts.variable.units %>"></span>
      <span class="new badge info uneditable" data-badge-caption="<%= opts.variable.type %>"></span>
    </li>
    `,
  },
  "units-search-results":
  `
  <% for(let i = 0; i < results.length; i++){%>
  <div class="row my-row si-unit-row" onclick="UpdateVariableUnits($(this))" fullUnitssString="<%= results[i] %>">
    <div class="col m12">
      <%= results[i] %>
    </div>
  </div>
  <% } %>
  `,
  "imported-variables-modal-content":
  `
  <div class="row">
    <h4><%= header %></h4>
  </div>
  <div class="row">
    <div class="col m12">
      <label>
        <input id="import-all-mechanics-variables" type="checkbox" />
        <span>Import All Variables</span>
      </label>
    </div>
  </div>
  <div class="row">
    <table>
      <thead>
        <tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Use</th>
        </tr>
      </thead>

      <tbody>
        <% for (const [key, value] of Object.entries(importedVariables)) {%>
        <tr>
          <td><span class="static-physics-equation" latex="<%= key %>"></span></td>
          <td><%= value.quantity %> (<%= value.units %>)</td>
          <td>
            <% if(value.disabled){%>
            <label>
              <input class="variable-checkbox" type="checkbox" rid="<%= value.rid %>" latex="<%= key %>" disabled="disabled"/>
              <span class=""></span>
            </label>
            <%}else if(value.checked){%>
              <label>
                <input class="variable-checkbox" type="checkbox" rid="<%= value.rid %>" latex="<%= key %>" checked="checked"/>
                <span class=""></span>
              </label>
            <%}else{%>
              <label>
                <input class="variable-checkbox" type="checkbox" rid="<%= value.rid %>" latex="<%= key %>"/>
                <span class=""></span>
              </label>
            <%}%>
          </td>
        </tr>
        <% } %>
      </tbody>
    </table>
  </div>
  `,
};
