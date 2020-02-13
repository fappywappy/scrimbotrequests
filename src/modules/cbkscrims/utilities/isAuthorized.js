export default function hasPermission(botModule, msg) {
  if (!botModule.config.permitted.length) return true;

  return msg.member.roles.some((role) => {
    return botModule.config.permitted.some(id => role.id === id);
  });
};