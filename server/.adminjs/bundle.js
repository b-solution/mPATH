(function (designSystem, React, adminjs) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const ExampleTabs = () => {
    const CLIENT_URL = window.AdminJS.env.REACT_APP_CUSTOM_VARIABLE;
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      flexGrow: 1,
      justifyContent: "end",
      alignItems: "center"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      color: "text",
      as: "a",
      href: CLIENT_URL
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "User"
    }), "Client Panel"));
  };

  const PasswordEdit = props => {
    const {
      onChange,
      property,
      record,
      resource
    } = props;
    const {
      translateButton: tb
    } = adminjs.useTranslation();
    const [showPassword, togglePassword] = React.useState(false);
    React.useEffect(() => {
      if (!showPassword) {
        onChange(property.name, '');
      }
    }, [onChange, showPassword]);
    // For new records always show the property
    if (!record.id) {
      return /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent.Password.Edit, props);
    }
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, showPassword && /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent.Password.Edit, props), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      textAlign: "center"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      onClick: () => togglePassword(!showPassword),
      type: "button"
    }, showPassword ? tb('cancel', resource.id) : tb('changePassword', resource.id)))));
  };

  AdminJS.UserComponents = {};
  AdminJS.env.REACT_APP_CUSTOM_VARIABLE = "http://localhost:9000";
  AdminJS.UserComponents.Version = ExampleTabs;
  AdminJS.UserComponents.PasswordEditComponent = PasswordEdit;

})(AdminJSDesignSystem, React, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdG9wLWJhci50c3giLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvcGFzc3dvcmRzL2J1aWxkL2NvbXBvbmVudHMvUGFzc3dvcmRFZGl0Q29tcG9uZW50LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJveCwgQnV0dG9uLCBJY29uIH0gZnJvbSBcIkBhZG1pbmpzL2Rlc2lnbi1zeXN0ZW1cIjtcbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuY29uc3QgRXhhbXBsZVRhYnMgPSAoKSA9PiB7XG4gIGNvbnN0IENMSUVOVF9VUkwgPSB3aW5kb3cuQWRtaW5KUy5lbnYuUkVBQ1RfQVBQX0NVU1RPTV9WQVJJQUJMRTtcbiAgcmV0dXJuIChcbiAgICA8Qm94IGZsZXggZmxleEdyb3c9ezF9IGp1c3RpZnlDb250ZW50PVwiZW5kXCIgYWxpZ25JdGVtcz1cImNlbnRlclwiPlxuICAgICAgPEJ1dHRvbiBjb2xvcj1cInRleHRcIiBhcz1cImFcIiBocmVmPXtDTElFTlRfVVJMfT5cbiAgICAgICAgPEljb24gaWNvbj1cIlVzZXJcIiAvPlxuICAgICAgICBDbGllbnQgUGFuZWxcbiAgICAgIDwvQnV0dG9uPlxuICAgIDwvQm94PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRXhhbXBsZVRhYnM7XG4iLCJpbXBvcnQgeyBCb3gsIEJ1dHRvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5Q29tcG9uZW50LCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5jb25zdCBQYXNzd29yZEVkaXQgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IG9uQ2hhbmdlLCBwcm9wZXJ0eSwgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVCdXR0b246IHRiIH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGNvbnN0IFtzaG93UGFzc3dvcmQsIHRvZ2dsZVBhc3N3b3JkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIXNob3dQYXNzd29yZCkge1xuICAgICAgICAgICAgb25DaGFuZ2UocHJvcGVydHkubmFtZSwgJycpO1xuICAgICAgICB9XG4gICAgfSwgW29uQ2hhbmdlLCBzaG93UGFzc3dvcmRdKTtcbiAgICAvLyBGb3IgbmV3IHJlY29yZHMgYWx3YXlzIHNob3cgdGhlIHByb3BlcnR5XG4gICAgaWYgKCFyZWNvcmQuaWQpIHtcbiAgICAgICAgcmV0dXJuIDxCYXNlUHJvcGVydHlDb21wb25lbnQuUGFzc3dvcmQuRWRpdCB7Li4ucHJvcHN9Lz47XG4gICAgfVxuICAgIHJldHVybiAoPEJveD5cbiAgICAgIHtzaG93UGFzc3dvcmQgJiYgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudC5QYXNzd29yZC5FZGl0IHsuLi5wcm9wc30vPn1cbiAgICAgIDxCb3ggbWI9XCJ4bFwiPlxuICAgICAgICA8VGV4dCB0ZXh0QWxpZ249XCJjZW50ZXJcIj5cbiAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9eygpID0+IHRvZ2dsZVBhc3N3b3JkKCFzaG93UGFzc3dvcmQpfSB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgICAgICB7c2hvd1Bhc3N3b3JkID8gdGIoJ2NhbmNlbCcsIHJlc291cmNlLmlkKSA6IHRiKCdjaGFuZ2VQYXNzd29yZCcsIHJlc291cmNlLmlkKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+KTtcbn07XG5leHBvcnQgZGVmYXVsdCBQYXNzd29yZEVkaXQ7XG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbkFkbWluSlMuZW52LlJFQUNUX0FQUF9DVVNUT01fVkFSSUFCTEUgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6OTAwMFwiXG5pbXBvcnQgVmVyc2lvbiBmcm9tICcuLi9zcmMvdG9wLWJhcidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVmVyc2lvbiA9IFZlcnNpb25cbmltcG9ydCBQYXNzd29yZEVkaXRDb21wb25lbnQgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3Bhc3N3b3Jkcy9idWlsZC9jb21wb25lbnRzL1Bhc3N3b3JkRWRpdENvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUGFzc3dvcmRFZGl0Q29tcG9uZW50ID0gUGFzc3dvcmRFZGl0Q29tcG9uZW50Il0sIm5hbWVzIjpbIkV4YW1wbGVUYWJzIiwiQ0xJRU5UX1VSTCIsIndpbmRvdyIsIkFkbWluSlMiLCJlbnYiLCJSRUFDVF9BUFBfQ1VTVE9NX1ZBUklBQkxFIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiQm94IiwiZmxleCIsImZsZXhHcm93IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiQnV0dG9uIiwiY29sb3IiLCJhcyIsImhyZWYiLCJJY29uIiwiaWNvbiIsIlBhc3N3b3JkRWRpdCIsInByb3BzIiwib25DaGFuZ2UiLCJwcm9wZXJ0eSIsInJlY29yZCIsInJlc291cmNlIiwidHJhbnNsYXRlQnV0dG9uIiwidGIiLCJ1c2VUcmFuc2xhdGlvbiIsInNob3dQYXNzd29yZCIsInRvZ2dsZVBhc3N3b3JkIiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJuYW1lIiwiaWQiLCJCYXNlUHJvcGVydHlDb21wb25lbnQiLCJQYXNzd29yZCIsIkVkaXQiLCJtYiIsIlRleHQiLCJ0ZXh0QWxpZ24iLCJvbkNsaWNrIiwidHlwZSIsIlVzZXJDb21wb25lbnRzIiwiVmVyc2lvbiIsIlBhc3N3b3JkRWRpdENvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUVBLE1BQU1BLFdBQVcsR0FBR0EsTUFBTTtJQUN4QixNQUFNQyxVQUFVLEdB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
