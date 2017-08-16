<% if (fontfaceStyles) { if (fontSrc1 && embed.length) { %>
@font-face {
  font-family:"<%= fontFamilyName %>";
  src: <%= fontSrc1 %>;
  font-weight:normal;
  font-style:normal;
} <% } %>@font-face {
  font-family:"<%= fontFamilyName %>";<% if (fontSrc1) { %>
  src:<%= fontSrc1 %>;<% }%>
  src:<%= fontSrc2 %>;
  font-weight:normal;
  font-style:normal;
}
<% } %><% if (iconsStyles) { %>
.<%= baseClass %> {
  font-family: "<%= fontFamilyName %>";
  <% for (var glyphIdx = 0; glyphIdx < glyphs.length; glyphIdx++) { %>
  &.<%= classPrefix %><%= glyphs[glyphIdx] %>:before {
    content: "\<%= codepoints[glyphIdx] %>";
  }<% } %>
}
<% } %>

<% if (iconsStyles) { %>
.lt-ie8 .<%= baseClass %> {
<% for (var glyphIdx = 0; glyphIdx < glyphs.length; glyphIdx++) { %>
  &.<%= classPrefix %><%= glyphs[glyphIdx] %> {
    clear: ~"expression(this.innerHTML=\"\<%= codepoints[glyphIdx] %>\", style.clear=\"none\", 0)";
  }
<% } %>
} 
<% } %>
